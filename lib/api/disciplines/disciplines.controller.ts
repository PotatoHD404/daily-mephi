import {createHandler, Delete, Get, Param, Post, SetHeader} from '@storyofams/next-api-decorators';
import {Controller} from "../../decorators/controller.decorator";


@Controller("/disciplines")
class DisciplinesController {

    @Get("/")
    public async get() {
        return ""
    }
}