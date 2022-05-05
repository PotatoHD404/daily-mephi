import {Get} from '@storyofams/next-api-decorators';
import {DisciplinesService} from "lib/api/disciplines/disciplines.service"
import {Controller} from "lib/injection/decorators/controller.decorator";

@Controller("/disciplines")
class DisciplinesController {

    constructor(private service: DisciplinesService) {
    }

    @Get("/")
    public async get() {
        return ""
    }
}