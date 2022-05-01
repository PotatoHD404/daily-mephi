import {Get} from '@storyofams/next-api-decorators';
import {Controller} from "lib/injection/decorators/controller.decorator";
import "lib/api/faculties/faculties.entity";

@Controller("/faculties")
class FacultiesController {

    @Get("/")
    public async get() {
        return ""
    }
}