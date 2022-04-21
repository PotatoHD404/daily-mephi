import {createHandler, Delete, Get, Param, Post, SetHeader} from '@storyofams/next-api-decorators';
import {Controller} from "lib/decorators/Controller";


@Controller("/comments")
export class CommentsController {



    @Post("/")
    public async add() {
        return ""
    }

    @Get("/")
    public async test() {
        return "1"
    }

    // @Delete("/:id")
    // public async delete(@Param('id') id: string) {
    //     return ""
    // }
}