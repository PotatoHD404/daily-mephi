import {Get} from '@storyofams/next-api-decorators';
import {Controller} from "lib/injection/decorators/controller.decorator";

@Controller("/disciplines")
class DisciplinesController {

    @Get("/")
    public async get() {
        return ""
    }
}