import {DB} from "lib/database/db";
import {inject} from "tsyringe";
import {camelToSnakeCase} from "helpers/utils";
import {Column, TableDescription, Ydb} from "ydb-sdk";
import {ENTITY_TOKEN} from "lib/database/decorators/entity.decorator";
import {Service} from "lib/decorators/injection/service.decorator";


// https://github.com/SpaceYstudentProject/SpaceYbaseAPI/blob/837e0ee5d4ef07e55e7df16dc374157b6044065d/sql/spaceYdb.sql

@Service()
export class MigrationService {


    constructor(private db: DB, @inject(ENTITY_TOKEN) private entities: any[]) {
    }

    getTableDescription(entity: any): TableDescription {
        let table = new TableDescription();
        if (entity.getRowType()['structType'] != undefined) {
            table = entity.getRowType().structType.members.reduce(
                (prev: TableDescription, curr: { name: string; type: Ydb.IType; }) => {
                    return prev.withColumn(new Column(
                        curr.name,
                        curr.type
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

    public async dropAll() {
        await this.db.withSession(async (session) => {
            for (const entity of this.entities) {
                const tableName = camelToSnakeCase(entity.name)
                await session.dropTable(tableName);
            }

            console.log();
        });
    }

    public async createAll() {
        await this.db.withSession(async (session) => {
            for (const entity of this.entities) {
                const tableName = camelToSnakeCase(entity.name)

                await session.createTable(
                    tableName,
                    this.getTableDescription(entity)
                );
            }

            console.log();
        });
    }

}