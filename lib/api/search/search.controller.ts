import {createHandler, Delete, Get, Param, Post, Put} from '@storyofams/next-api-decorators';

export class SearchController {

    @Get("/tutors")
    public async getTutors() {
        return ""
    }

    @Get("/materials")
    public async getMaterials() {
        return ""
    }
}