import {Get} from "@storyofams/next-api-decorators";
import {Controller} from "../../decorators/Controller";


@Controller()
class CommentsService {
    @Get("/bob")
    func1() {
        return "123"
    }

}