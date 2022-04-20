import {createHandler, Delete, Get, Param, Post, Put} from '@storyofams/next-api-decorators';

class ReviewsHandler {

    @Get("/:id")
    public async get(@Param('id') id: string) {
        return ""
    }

    @Post("/")
    public async add(@Param('id') id: string) {
        return ""
    }

    @Put("/:id")
    public async edit(@Param('id') id: string) {
        return ""
    }

    @Delete("/:id")
    public async delete(@Param('id') id: string) {
        return ""
    }
}

export default createHandler(ReviewsHandler);