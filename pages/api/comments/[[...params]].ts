import {createHandler, Delete, Get, Param, Post, SetHeader} from '@storyofams/next-api-decorators';
import {Controller} from "lib/decorators/Controller";
import {createHandlers} from "../../../helpers/utils";

type CommentType = "materials" | "reviews" | "news" | "comments";

@Controller("/comments")
class CommentsHandler {

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

export default createHandlers(CommentsHandler);