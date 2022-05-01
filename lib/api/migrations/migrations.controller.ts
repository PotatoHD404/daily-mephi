import {Get} from '@storyofams/next-api-decorators';
import {Controller} from "lib/decorators/injection/controller.decorator";
import {MigrationService} from "./migrations.service";


// TODO: make it only for admins
@Controller("/migrations")
export class MigrationsController {

    constructor(private migrationService: MigrationService) {
    }


    @Get("/up")
    public async up() {
        await this.migrationService.migrate();
        return "ok";
    }

}