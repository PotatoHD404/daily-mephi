import {createHandler, Delete, Get, Param, Post, Put} from '@storyofams/next-api-decorators';
import {Controller} from "../../decorators/injection/controller.decorator";
import "./quotes.entity";

@Controller("/quotes")
class QuotesController {

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