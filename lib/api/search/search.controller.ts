import {createHandler, Delete, Get, Param, Post, Put} from '@storyofams/next-api-decorators';
import {Controller} from "../../decorators/controller.decorator";

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