import {createHandler, Delete, Get, Param, Post, SetHeader} from '@storyofams/next-api-decorators';
import {Controller} from "../../decorators/controller.decorator";

@Controller("/faculties")
class FacultiesController {

    @Get("/")
    public async get() {
        return ""
    }
}