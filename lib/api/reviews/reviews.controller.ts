import {Delete, Get, Param, Post, Put} from '@storyofams/next-api-decorators';
import {ReviewsService} from "lib/api/reviews/reviews.service";
import {Controller} from "lib/injection/decorators/controller.decorator";

@Controller("/reviews")
class ReviewsController {

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