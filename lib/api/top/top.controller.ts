import {createHandler, Delete, Get, Param, Post, Put} from '@storyofams/next-api-decorators';
import {Controller} from "../../decorators/controller.decorator";

@Controller("/top")
class TopController {

    @Get("/")
    public async get() {
        return ""
    }
}