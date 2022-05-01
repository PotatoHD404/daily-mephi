import {Delete, Get, Param, Post, Put} from '@storyofams/next-api-decorators';
import {Controller} from "../../decorators/injection/controller.decorator";
import {MaterialsService} from "./materials.service";

@Controller("/materials")
export class MaterialsController {
    constructor(private materialsService: MaterialsService) {
    }

    @Get("/:id")
    public async get(@Param('id') id: string) {
        return "1"
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