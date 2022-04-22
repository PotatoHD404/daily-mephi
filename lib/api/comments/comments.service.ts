import {Service} from "lib/decorators/service.decorator";
import {CommentsRepository} from "./comments.repository";


@Service()
export class CommentsService {
    constructor(private repository: CommentsRepository) {
    }
    async test(){
        await this.repository.find({});
    }
}