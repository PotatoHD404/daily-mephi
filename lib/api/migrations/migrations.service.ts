import {DB} from "lib/database/db";
import {autoInjectable, inject, injectAll, singleton} from "tsyringe";
import {camelToSnakeCase, getEntityProperty, sameMembers, typeToString} from "helpers/utils";
import {
    AlterTableDescription,
    Column,
    CreateTableSettings,
    Session,
    TableDescription,
    TableIndex,
    Types,
    Ydb
} from "ydb-sdk";
import {ENTITY_TOKEN} from "lib/decorators/entity.decorator";
import {Service} from "lib/decorators/service.decorator";
import {BadRequest} from "ydb-sdk/build/errors";
import {Materials} from "../materials/materials.entity";
import {INDEX_TOKEN, PRIMARY_KEY_TOKEN} from "../../decorators/column.decorators";
import {retryable} from "ydb-sdk/build/retries";
import {pessimizable} from "ydb-sdk/build/utils";
import {PatchedSession} from "../../database/PatchedSession";


// https://github.com/SpaceYstudentProject/SpaceYbaseAPI/blob/837e0ee5d4ef07e55e7df16dc374157b6044065d/sql/spaceYdb.sql


@Service()
export class MigrationService {

    private readonly entities: any[]

    constructor(private db: DB, @injectAll(ENTITY_TOKEN) entities: any[]) {
        this.entities = entities.map(entity => new entity);
    }

    getTableDescription(entity: any): TableDescription {
        let table = new TableDescription();
        // console.log(entity.getRowType()['structType'])
        if (entity.getRowType()['structType'] != undefined) {
            table = entity.getRowType().structType.members.reduce(
                (prev: TableDescription, curr: { name: string; type: Ydb.IType; }) => {
                    return prev.withColumn(new Column(
                        curr.name,
                        Types.optional(curr.type)
                    ));
                },
                table)
        }
        console.table(getEntityProperty(entity, PRIMARY_KEY_TOKEN))
        table.withPrimaryKeys(...getEntityProperty(entity, PRIMARY_KEY_TOKEN))
        const indexes: string[] = Reflect.getMetadata(INDEX_TOKEN, entity) ?? [];
        table = indexes.reduce((prev: TableDescription, indexName: string) => {
            const index = new TableIndex(indexName);
            index.withIndexColumns(...getEntityProperty(entity, indexName));
            if (index.indexColumns.length > 0)
                return prev.withIndex(index);
            return prev;
        }, table)
        // table.withIndexes(...getEntityProperty(entity, INDEX_TOKEN))
        return table;
    }

    //


    public async dropAndRecreateAll() {
        await this.db.withSession(async (session) => {
            for (const entity of this.entities) {
                const tableName = camelToSnakeCase(entity.name)
                await session.dropTable(tableName);

                await session.createTable(
                    tableName,
                    this.getTableDescription(entity)
                );
            }
        });
    }

    public async dropAll(session: Session) {
        for (const entity of this.entities) {
            await this.dropTable(session, entity);
        }
    }

    public async dropTable(session: Session, entity: any) {
        const tableName = camelToSnakeCase(entity.constructor.name);
        await session.dropTable(tableName);
    }

    // SchemeError:
    public async migrate() {
        await this.db.withSession(async (session) => {
                await this.createAll(session);
                for (const entity of this.entities) {
                    const tableName = camelToSnakeCase(entity.constructor.name);

                    let desc = new AlterTableDescription();
                    const tableDescription = (await session.describeTable(tableName)).toJSON();
                    console.log(tableDescription)

                    const rowType = entity.getRowType();
                    type Col = { name: string; type: Ydb.IType; };
                    type Index = { name: string; indexColumns: string[], globalIndex: object, status: string };
                    const columns: Col[] = tableDescription['columns'];
                    const primaryKeys: string[] = tableDescription['primaryKey'];
                    const indexes: Index[] = tableDescription['indexes'] ?? [];
                    let withPrimary = false;
                    const entityColumns = rowType.structType.members;
                    const entityIndexes: string[] = Reflect.getMetadata(INDEX_TOKEN, entity) ?? [];

                    desc = entityColumns.reduce(
                        (prev: AlterTableDescription, curr: Col) => {

                            if (withPrimary)
                                return;

                            if (columns.find((col) => {
                                return col.name === curr.name &&
                                    // @ts-ignore
                                    col.type.optionalType?.item?.typeId !== typeToString(curr.type)
                            })) {
                                if (primaryKeys.includes(curr.name)) {
                                    withPrimary = true;
                                    return prev;
                                }
                                return prev.withAlterColumn(new Column(
                                    curr.name,
                                    Types.optional(curr.type)
                                ));
                            } else if (!columns.find((col) => {
                                return col.name === curr.name
                            })) {
                                return prev.withAddColumn(new Column(
                                    curr.name,
                                    Types.optional(curr.type)
                                ));
                            }
                            return prev;
                        },
                        desc)
                    desc = columns.reduce((prev: AlterTableDescription, curr: Col) => {
                        if (!entityColumns.find((col: Col) => {
                            return col.name === curr.name
                        })) {
                            if (withPrimary)
                                return prev;

                            if (primaryKeys.includes(curr.name)) {
                                withPrimary = true;
                                return prev;
                            }
                            return prev.withDropColumn(curr.name);
                        }
                        return prev;
                    }, desc);

                    desc = entityIndexes.reduce((prev: AlterTableDescription, curr: string) => {
                        const indexColumns = getEntityProperty(entity, curr);
                        if (indexes.find(index => index.name === curr && !sameMembers(index.indexColumns, indexColumns))) {
                            prev.dropIndexes.push(curr)
                            MigrationService.addIndex(curr, indexColumns, prev);
                        } else if (!indexes.find((index => index.name === curr))) {
                            MigrationService.addIndex(curr, indexColumns, prev);
                        }
                        return prev;
                    }, desc);

                    desc = indexes.reduce((prev: AlterTableDescription, curr: Index) => {
                        if (!entityIndexes.includes(curr.name)) {
                            prev.dropIndexes.push(curr.name)
                            return prev
                        }
                        return prev;
                    }, desc);

                    if (withPrimary) {
                        await this.dropTable(session, entity)
                        await this.createTable(session, entity)
                        return;
                    }
                    console.log(desc)
                    if (desc.addColumns.length > 0 ||
                        desc.alterColumns.length > 0 ||
                        desc.dropColumns.length > 0 ||
                        desc.addIndexes.length > 0 ||
                        desc.dropIndexes.length > 0) {
                        await new PatchedSession(session).alterTable(tableName, desc);
                    }

                }

                return;
            }
        );
    }

    private static addIndex(curr: string, indexColumns: string[], prev: AlterTableDescription) {
        const index = new TableIndex(curr);
        index.withIndexColumns(...indexColumns);
        prev.addIndexes.push(index)
    }

    public async createAll(session: Session): Promise<void> {
        for (const entity of this.entities) {

            await this.createTable(session, entity);
        }
    }

    public async createTable(session: Session, entity: any) {
        const tableName = camelToSnakeCase(entity.constructor.name)
        // console.log(this.getTableDescription(new entity))
        const desc = this.getTableDescription(entity);
        if (desc.columns.length > 0 && desc.primaryKey.length > 0)
            await session.createTable(
                tableName,
                desc
            );
        else {
            throw new Error("There is not enough columns or primary keys");
        }
    }
}