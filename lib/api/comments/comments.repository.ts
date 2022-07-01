import {Comment} from "lib/entities";
import {BaseRepo} from "lib/database/baseRepo";
import {Repository} from "lib/database/decorators/repository.decorator";

@Repository(Comment)
export class CommentsRepository extends BaseRepo<Comment> {

}