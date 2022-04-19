import {createHandler, Delete, Get, Param, Post, SetHeader} from '@storyofams/next-api-decorators';

type CommentType = "materials" | "reviews" | "news" | "comments";

class CommentsHandler {

    @Get("/")
    public async get() {
        return ""
    }
}

export default createHandler(CommentsHandler);