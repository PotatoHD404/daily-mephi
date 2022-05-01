import {Delete, Get, Param, Post, Put} from '@storyofams/next-api-decorators';
import {UsersService} from "lib/api/users/users.service";
import {Controller} from "lib/injection/decorators/controller.decorator";
import "lib/api/users/users.entity"

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