import {Get} from '@storyofams/next-api-decorators';
import {FacultiesService} from "lib/api/faculties/faculties.service";
import {Controller} from "lib/injection/decorators/controller.decorator";

@Controller("/faculties")
class FacultiesController {

    constructor(private service: FacultiesService) {
    }

    @Get("/")
    public async get() {
        await this.service.getAll()
        return "ok"
    }
}