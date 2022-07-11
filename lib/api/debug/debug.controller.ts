import {Delete, Get, Param, Post, Put} from '@storyofams/next-api-decorators';
import {Controller} from "lib/injection/decorators/controller.decorator";
import {PrismaClient} from "@prisma/client";

@Controller("/debug")
class DebugController {

    constructor(private service: PrismaClient) {
    }

    @Get("/")
    public async get() {
        return ""
    }



}