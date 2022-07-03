import {Delete, Get, Param, Post, Put} from '@storyofams/next-api-decorators';
import {QuotesService} from "lib/api/quotes/quotes.service";
import {Controller} from "lib/injection/decorators/controller.decorator";

@Controller("/quotes")
class QuotesController {

    constructor(private service: QuotesService) {
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