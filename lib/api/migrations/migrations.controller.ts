import {createHandler, Delete, Get, Param, Post, Put} from '@storyofams/next-api-decorators';
import {Controller} from "lib/decorators/controller.decorator";
import {MigrationService} from "./migrations.service";
import {Column, Primary, PRIMARY_KEY_TOKEN} from "../../decorators/column.decorators";


class TestEntity {
    @Column()
    @Primary()
    private a: number = 0;
}

// TODO: make it only for admins
@Controller("/migrations")
export class MigrationsController {

    constructor(private migrationService: MigrationService) {
        const entity = new TestEntity;
        console.log()
    }


    @Get("/up")
    public async up() {
        await this.migrationService.migrate();

        return "ok"
    }

}