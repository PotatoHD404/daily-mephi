import {createHandler, Delete, Get, Param, Post, SetHeader} from '@storyofams/next-api-decorators';

type CommentType = "materials" | "reviews" | "news" | "comments";

export class CommentsController {

    @Get("/")
    public async get() {
        return ""
    }
}