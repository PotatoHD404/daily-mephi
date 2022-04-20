import {createHandler, Delete, Get, Param, Post, SetHeader} from '@storyofams/next-api-decorators';
import {Controller} from "lib/decorators/Controller";

type CommentType = "materials" | "reviews" | "news" | "comments";

@Controller()
class CommentsHandler {

    @Post("/")
    public async add(@Param('type') type: CommentType, @Param('id') id: string) {
        return ""
    }

    @Delete("/:id")
    public async delete(@Param('type') type: CommentType, @Param('id') id: string) {
        return ""
    }
}

export default createHandler(CommentsHandler);