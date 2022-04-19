import {createHandler, Delete, Get, Param, Post, Put} from '@storyofams/next-api-decorators';

class UsersHandler {

    @Get("/:id")
    public async get(@Param('id') id: string) {
        return ""
    }

    @Post("/")
    public async add() {
        return ""
    }

    @Put("/")
    public async edit() {
        return ""
    }

    @Delete("/")
    public async delete() {
        return ""
    }
}

export default createHandler(UsersHandler);