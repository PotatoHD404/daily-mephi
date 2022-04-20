import {createHandler, Delete, Get, Param, Post, Put} from '@storyofams/next-api-decorators';

class SearchHandler {

    @Get("/tutors")
    public async getTutors() {
        return ""
    }

    @Get("/materials")
    public async getMaterials() {
        return ""
    }
}

export default createHandler(SearchHandler);