import {DB} from "lib/database/db";
import {autoInjectable, inject, injectAll, singleton} from "tsyringe";
import {camelToSnakeCase, getEntityProperty, typeToString} from "helpers/utils";
import {AlterTableDescription, Column, Session, TableDescription, Types, Ydb} from "ydb-sdk";
import {ENTITY_TOKEN} from "lib/decorators/entity.decorator";
import {Service} from "lib/decorators/service.decorator";
import {BadRequest} from "ydb-sdk/build/errors";
import {Materials} from "../materials/materials.entity";
import {INDEX_TOKEN, PRIMARY_KEY_TOKEN} from "../../decorators/column.decorators";


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
        table.withPrimaryKeys(...getEntityProperty(entity, PRIMARY_KEY_TOKEN))
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
                    // try {

                    let desc = new AlterTableDescription();
                    const tableDescription = (await session.describeTable(tableName)).toJSON();
                    // console.log(tableDescription)
                    // console.log((new entity).getRowType().structType.members)
                    const rowType = entity.getRowType();
                    type Col = { name: string; type: Ydb.IType; };
                    const columns: Array<Col> = tableDescription['columns'];
                    const primaryKeys: Array<string> = tableDescription['primaryKey'];
                    let withPrimary = false;
                    desc = rowType.structType.members.reduce(
                        (prev: AlterTableDescription, curr: Col) => {
                            // console.log(Types.optional(curr.type))

                            if (withPrimary)
                                return;
                            // const description = tableDescription;
                            // const description = tableDescription.toJSON();
                            if (columns.find((col) => {
                                return col.name === curr.name &&
                                    // @ts-ignore
                                    col.type.optionalType?.item?.typeId !== typeToString(curr.type)
                            })) {
                                // console.log("'" + curr.name + "'")
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
                    if (withPrimary) {
                        await this.dropTable(session, entity)
                        await this.createTable(session, entity)
                        return;
                    }

                    desc = columns.reduce((prev: AlterTableDescription, curr: Col) => {
                        if (!rowType.structType.members.find((col: Col) => {
                            return col.name === curr.name
                        })) {
                            return prev.withDropColumn(curr.name);
                        }
                        return prev;
                    }, desc);
                    if (desc.addColumns.length > 0 || desc.alterColumns.length > 0 || desc.dropColumns.length > 0)
                        await session.alterTable(tableName, desc);

                    // }
                    // catch (e){
                    //     console.log(e);
                    // }

                    // await session.dropTable(tableName);
                }

                // console.log();
                return;
            }
        );
    }

    public async createAll(session: Session): Promise<void> {
        for (const entity of this.entities) {

            await this.createTable(session, entity);
        }
    }

    public async createTable(session: Session, entity: any){
        const tableName = camelToSnakeCase(entity.constructor.name)
        // console.log(this.getTableDescription(new entity))
        await session.createTable(
            tableName,
            this.getTableDescription(entity).withPrimaryKey("a")
        );
    }
}