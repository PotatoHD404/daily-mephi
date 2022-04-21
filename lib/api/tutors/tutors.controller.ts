import {createHandler, Delete, Get, Param, Post, Put} from '@storyofams/next-api-decorators';
import {Controller} from "../../decorators/controller.decorator";

@Controller("/tutors")
class TutorsController {

    @Get("/:id")
    public async get(@Param('id') id: string) {
        return ""
    }

    @Get("/:id/reviews")
    public async getReviews(@Param('id') id: string) {
        return ""
    }

    @Get("/:id/reviews/comments")
    public async getCommentsToReviews(@Param('id') id: string) {
        return ""
    }

    @Get("/:id/quotes")
    public async getQuotes(@Param('id') id: string) {
        return ""
    }

    @Get("/:id/materials")
    public async getMaterials(@Param('id') id: string) {
        return ""
    }

    @Post("/")
    public async add() {
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