import {createHandler, Delete, Get, Param, Post, Put} from '@storyofams/next-api-decorators';
import {Controller} from "lib/decorators/controller.decorator";
import {MigrationService} from "./migrations.service";


// TODO: make it only for admins
@Controller("/migrations")
export class MigrationsController {

    constructor(private migrationService: MigrationService) {
    }


    @Get("/up")
    public async up() {
        await this.migrationService.migrate();

        console.log(await this.migrationService.getTableDesc('materials1'));
        // console.log(await this.migrationService.getTableDesc('materials1'));
        return "ok";
    }

}