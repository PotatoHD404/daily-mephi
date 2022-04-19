import {createHandler, Delete, Get, Param, Post, Put} from '@storyofams/next-api-decorators';

class TopHandler {

    @Get("/")
    public async get() {
        return ""
    }
}

export default createHandler(TopHandler);