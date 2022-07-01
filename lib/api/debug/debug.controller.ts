import {Get} from '@storyofams/next-api-decorators';
import {DisciplinesService} from "lib/api/disciplines/disciplines.service"
import {Controller} from "lib/injection/decorators/controller.decorator";

@Controller("/debug")
class DebugController {

    constructor(private service: DisciplinesService) {
    }

    @Get("/")
    public async get() {
        return "Hello world"
    }
}