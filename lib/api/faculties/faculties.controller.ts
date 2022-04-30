import {createHandler, Delete, Get, Param, Post, SetHeader} from '@storyofams/next-api-decorators';
import {Controller} from "../../decorators/injection/controller.decorator";
import "./faculties.entity";

@Controller("/faculties")
class FacultiesController {

    @Get("/")
    public async get() {
        return ""
    }
}