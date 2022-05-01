import {Get} from '@storyofams/next-api-decorators';
import {Controller} from "../../decorators/injection/controller.decorator";

@Controller("/disciplines")
class DisciplinesController {

    @Get("/")
    public async get() {
        return ""
    }
}