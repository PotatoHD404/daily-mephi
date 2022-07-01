import {Quote} from "lib/entities";
import {BaseRepo} from "lib/database/baseRepo";
import {Repository} from "lib/database/decorators/repository.decorator";

@Repository(Quote)
export class QuotesRepository extends BaseRepo<Quote> {

}