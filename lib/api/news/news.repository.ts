import {News} from "lib/entities";
import {BaseRepo} from "lib/database/baseRepo";
import {Repository} from "lib/database/decorators/repository.decorator";

@Repository(News)
export class NewsRepository extends BaseRepo<News> {

}