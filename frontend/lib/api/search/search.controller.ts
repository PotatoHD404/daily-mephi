import {Get} from '@storyofams/next-api-decorators';
import {SearchService} from "lib/api/search/search.service";
import {Controller} from "lib/injection/decorators/controller.decorator";

@Controller("/search")
class SearchController {

    constructor(private service: SearchService) {
    }

    @Get("/tutors")
    public async getTutors() {
        return ""
    }

    @Get("/materials")
    public async getMaterials() {
        return ""
    }
}