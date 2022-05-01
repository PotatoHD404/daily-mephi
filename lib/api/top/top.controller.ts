import {Get} from '@storyofams/next-api-decorators';
import {Controller} from "lib/injection/decorators/controller.decorator";

@Controller("/top")
class TopController {

    @Get("/")
    public async get() {
        return ""
    }
}