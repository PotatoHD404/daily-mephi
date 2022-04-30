import {createHandler, Delete, Get, Param, Post, SetHeader} from '@storyofams/next-api-decorators';
import {Controller} from "../../decorators/injection/controller.decorator";
import "./disciplines.entity";

@Controller("/disciplines")
class DisciplinesController {

    @Get("/")
    public async get() {
        return ""
    }
}