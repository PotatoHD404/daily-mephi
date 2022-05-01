import {Service} from "lib/injection/decorators/service.decorator";
import {CommentsRepository} from "lib/api/comments/comments.repository";


@Service()
export class CommentsService {
    constructor(private repository: CommentsRepository) {
    }

    async test() {
        await this.repository.find({});
    }
}