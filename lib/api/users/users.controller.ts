import {createHandler, Delete, Get, Param, Post, Put} from '@storyofams/next-api-decorators';
import {Controller} from "../../decorators/controller.decorator";


@Controller("/users")
class UsersController {

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