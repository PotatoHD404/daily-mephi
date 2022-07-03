import {Delete, Get, Param, Post, Put} from '@storyofams/next-api-decorators';
import {Controller} from "lib/injection/decorators/controller.decorator";
import {NewsService} from "lib/api/news/news.service";

@Controller("/news")
class NewsController {

    constructor(private service: NewsService) {
    }

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