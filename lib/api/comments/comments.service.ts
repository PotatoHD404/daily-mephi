import {Comment} from "lib/api/comments/comments.entity";
import {CommentsRepository} from "lib/api/comments/comments.repository";
import {Service} from "lib/injection/decorators/service.decorator";

@Service()
export class CommentsService {
    constructor(private repository: CommentsRepository) {
    }


}