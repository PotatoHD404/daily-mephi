import {Catch, createHandler, Delete, Get, Param, Post, SetHeader} from '@storyofams/next-api-decorators';
import {Controller} from "lib/decorators/injection/controller.decorator";
import {CommentsService} from "./comments.service";
import "./comments.entity"


@Controller("/comments")
class CommentsController {
    constructor(private service: CommentsService) {
    }

    @Post("/")
    public async add() {

        return "23222224";
    }

    @Get("/")
    public async test() {
        await this.service.test();
        return "123"
    }

}