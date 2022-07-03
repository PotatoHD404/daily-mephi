import {Get, UseMiddleware} from '@storyofams/next-api-decorators';
import {FacultiesService} from "lib/api/faculties/faculties.service";
import {NextSession} from "lib/auth/decorators/session.decorator";
import {Cors} from "lib/auth/middlewares/cors.middleware";
import {RateLimit} from "lib/auth/middlewares/rateLimit.middleware";
import {Controller} from "lib/injection/decorators/controller.decorator";
import {Session} from "next-auth";

@Controller("/faculties")
class FacultiesController {

    constructor(private service: FacultiesService) {
    }

    @Get("/")
    public async get(@NextSession() session: Session) {
        console.log(session);
        console.log(await this.service.getAll());
        return {status: "ok"}
    }
}