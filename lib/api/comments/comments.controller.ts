import {Get, Post} from '@storyofams/next-api-decorators';
import {CommentsService} from "lib/api/comments/comments.service"
import {Controller} from "lib/injection/decorators/controller.decorator";
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