import {createHandler, Delete, Get, Param, Post, SetHeader} from '@storyofams/next-api-decorators';
import {Controller} from "lib/decorators/controller.decorator";
import {CommentsService} from "./comments.service";


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
        return "123"
    }

}