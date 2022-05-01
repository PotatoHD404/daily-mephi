import {Delete, Get, Param, Post, Put} from '@storyofams/next-api-decorators';
import {Controller} from "lib/injection/decorators/controller.decorator";
import "lib/api/news/news.entity";

@Controller("/news")
class NewsController {

    @Get("/:id")
    public async get(@Param('id') id: string) {
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