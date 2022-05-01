import {Get} from '@storyofams/next-api-decorators';
import {TopService} from "lib/api/top/top.service";
import {Controller} from "lib/injection/decorators/controller.decorator";

@Controller("/top")
class TopController {

    @Get("/")
    public async get() {
        return ""
    }
}