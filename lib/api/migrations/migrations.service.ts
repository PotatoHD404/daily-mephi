import {DB} from "lib/database/db";
import {autoInjectable, inject, injectAll, singleton} from "tsyringe";
import {camelToSnakeCase} from "helpers/utils";
import {Column, TableDescription, Types, Ydb} from "ydb-sdk";
import {ENTITY_TOKEN} from "lib/decorators/entity.decorator";
import {Service} from "lib/decorators/service.decorator";


// https://github.com/SpaceYstudentProject/SpaceYbaseAPI/blob/837e0ee5d4ef07e55e7df16dc374157b6044065d/sql/spaceYdb.sql



@Service()
export class MigrationService {


    constructor(private db: DB, @injectAll(ENTITY_TOKEN) private entities: any[]) {
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
        return table;
    }


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

            console.log();
        });
    }

    public async dropAll(){
        await this.db.withSession(async (session) => {
            for (const entity of this.entities) {
                const tableName = camelToSnakeCase(entity.name)
                await session.dropTable(tableName);
            }

            console.log();
        });
    }

    public async createAll(){
        await this.db.withSession(async (session) => {
            for (const entity of this.entities) {
                const tableName = camelToSnakeCase(entity.name)
                // console.log(this.getTableDescription(new entity))
                await session.createTable(
                    tableName,
                    this.getTableDescription(new entity).withPrimaryKey("a")
                );
            }

            console.log();
        });
    }

}