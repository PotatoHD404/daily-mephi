import {getColumnName, getEntityProperty, getRowType, getTableName, sameMembers, typeToString} from "helpers/utils";
import {DB} from "lib/database/db";
import {PRIMARY_KEY_TOKEN} from "lib/database/decorators/column.decorators";
import {ENTITY_TOKEN} from "lib/database/decorators/entity.decorator";
import {INDEX_TOKEN} from "lib/database/decorators/index.decorator";
import {PatchedSession} from "lib/database/patchedSession";
import {Service} from "lib/injection/decorators/service.decorator";
import {injectAll} from "tsyringe";
import {AlterTableDescription, Column, Session, TableDescription, TableIndex, Types, Ydb} from "ydb-sdk";

// https://github.com/SpaceYstudentProject/SpaceYbaseAPI/blob/837e0ee5d4ef07e55e7df16dc374157b6044065d/sql/spaceYdb.sql

type Col = { name: string; type: Ydb.IType; };


@Service()
export class MigrationService {

    private readonly entities: any[]

    constructor(private db: DB, @injectAll(ENTITY_TOKEN) entities: any[]) {
        this.entities = entities;
    }

    private static addIndex(curr: string, indexColumns: string[], prev: AlterTableDescription) {
        const index = new TableIndex(curr);
        index.withIndexColumns(...indexColumns);
        prev.addIndexes.push(index)
    }

    //

    getTableDescription(entity: any): TableDescription {
        let table = new TableDescription();
        console.log(getRowType(entity))
        if (getRowType(entity)['structType'] != undefined) {
            table = getRowType(entity).structType.members.reduce(
                (prev: TableDescription, curr: Col) => {
                    return prev.withColumn(new Column(
                        curr.name,
                        Types.optional(curr.type)
                    ));
                },
                table)
        }

        // console.log(getEntityProperty(entity, PRIMARY_KEY_TOKEN))
        table.withPrimaryKeys(...getEntityProperty(entity, PRIMARY_KEY_TOKEN).map(el => getColumnName(entity, el)))
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

    public async dropAll(session: Session) {
        for (const entity of this.entities) {
            await this.dropTable(session, entity);
        }
    }

    public async dropTable(session: Session, entity: any) {
        const tableName = getTableName(entity);
        await session.dropTable(tableName);
    }

    public async migrateAll() {
        await this.db.withSession(async (session) => {
            await this.dropAll(session)
            await this.createAll(session);
        });
    }

    // SchemeError:
    public async alterAll() {
        await this.db.withSession(async (session) => {
            await this.createAll(session);
            for (const entity of this.entities) {
                const tableName = getTableName(entity);

                let desc = new AlterTableDescription();
                const tableDescription = (await session.describeTable(tableName)).toJSON();
                console.log(tableDescription)

                const rowType = getRowType(entity);
                type Index = { name: string; indexColumns: string[], globalIndex: object, status: string };
                const columns: Col[] = tableDescription['columns'];
                const primaryKeys: string[] = tableDescription['primaryKey'];
                const indexes: Index[] = tableDescription['indexes'] ?? [];
                let withPrimary = false;
                const entityColumns: any[] = rowType.structType.members.map((el: Col) => {
                    return {name: el.name, type: el.type}
                });
                const entityIndexes: string[] = Reflect.getMetadata(INDEX_TOKEN, entity) ?? [];

                desc = entityColumns.reduce(
                    (prev: AlterTableDescription, curr: Col) => {

                        if (withPrimary)
                            return prev;

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
                    // console.log(desc);

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
                    // if(desc.alterColumns[0]?.type?.optionalType?.item)
                    //     console.log(desc.alterColumns[0]?.type?.optionalType?.item)
                    if (desc.addColumns.length > 0 ||
                        desc.alterColumns.length > 0 ||
                        desc.dropColumns.length > 0 ||
                        desc.addIndexes.filter(el => el.indexColumns.length > 0).length > 0 ||
                        desc.dropIndexes.length > 0) {
                        await new PatchedSession(session).alterTable(tableName, desc);
                    }

                }

                return;
            }
        );
    }

    public async createAll(session: Session): Promise<void> {
        for (const entity of this.entities) {

            await this.createTable(session, entity);
        }
    }

    public async createTable(session: Session, entity: any) {
        const tableName = getTableName(entity)
        // console.log(tableName)
        // console.log(this.getTableDescription(new entity))
        const desc = this.getTableDescription(entity);
        console.log(tableName);
        console.log(desc);
        if (desc.columns.length > 0 && desc.primaryKey.length > 0)
            await session.createTable(
                tableName,
                desc
            );
        else {
            throw new Error("There is not enough columns or primary keys");
        }
    }

    public async getTableDesc(tableName: string) {
        let res: { [p: string]: any } = {};
        await this.db.withSession(async (session) => {

            res = (await session.describeTable(tableName)).toJSON()
        });
        return res;
    }
}