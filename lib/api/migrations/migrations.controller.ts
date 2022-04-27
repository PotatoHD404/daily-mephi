import {createHandler, Delete, Get, Param, Post, Put} from '@storyofams/next-api-decorators';
import {Controller} from "lib/decorators/controller.decorator";
import {MigrationService} from "./migrations.service";


// TODO: make it only for admins
@Controller("/migrations")
export class MigrationsController {

    constructor(private migrationService: MigrationService) {
    }

    @Get("/down")
    public async down() {
        await this.migrationService.dropAll()

        return "ok"
    }

    @Get("/up")
    public async up() {
        await this.migrationService.createAll()

        return "ok"
    }

    @Get("/down_up")
    public async downUp() {
        await this.migrationService.dropAndRecreateAll()
        return "ok"
    }
}