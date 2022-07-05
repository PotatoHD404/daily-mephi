import {Get, UseMiddleware} from '@storyofams/next-api-decorators';
import {FacultiesService} from "lib/api/faculties/faculties.service";
import {NextSession} from "lib/auth/decorators/session.decorator";
import {Cors} from "lib/auth/middlewares/cors.middleware";
import {Controller} from "lib/injection/decorators/controller.decorator";
import * as nextAuth from "next-auth";

@Controller("/faculties")
class FacultiesController {

    constructor(private service: FacultiesService) {
    }

    @Get("/")
    public async get(@NextSession() session: nextAuth.Session) {
        console.log(session);
        console.log(await this.service.getAll());
        return {status: "ok"}
    }
}