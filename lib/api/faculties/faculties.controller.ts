import {Get} from '@storyofams/next-api-decorators';
import {FacultiesService} from "lib/api/faculties/faculties.service";
import {Controller} from "lib/injection/decorators/controller.decorator";
import "lib/api/faculties/faculties.entity";

@Controller("/faculties")
class FacultiesController {

    constructor(private service: FacultiesService) {
    }

    @Get("/")
    public async get() {
        console.log(this.service.getAll());
        return "ok"
    }
}