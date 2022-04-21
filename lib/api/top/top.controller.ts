import {createHandler, Delete, Get, Param, Post, Put} from '@storyofams/next-api-decorators';

export class TopController {

    @Get("/")
    public async get() {
        return ""
    }
}