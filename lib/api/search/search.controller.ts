import {Get} from '@storyofams/next-api-decorators';
import {Controller} from "lib/injection/decorators/controller.decorator";

@Controller("/search")
class SearchController {

    @Get("/tutors")
    public async getTutors() {
        return ""
    }

    @Get("/materials")
    public async getMaterials() {
        return ""
    }
}