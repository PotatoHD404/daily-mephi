import {Get} from '@storyofams/next-api-decorators';
import {Controller} from "lib/injection/decorators/controller.decorator";
import {MigrationService} from "lib/api/migrations/migrations.service";


// TODO: make it only for admins
@Controller("/migrations")
export class MigrationsController {

    constructor(private migrationService: MigrationService) {
    }


    @Get("/")
    public async up() {
        await this.migrationService.alterAll();
        return {status: "ok"};
    }

    // @Get("/down")
    // public async down() {
    //     await this.migrationService.dropAll();
    //     return "ok";
    // }

}