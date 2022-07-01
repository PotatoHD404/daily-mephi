import {Rate} from "lib/entities";
import {BaseRepo} from "lib/database/baseRepo";
import {Repository} from "lib/database/decorators/repository.decorator";

@Repository(Rate)
export class RatesRepository extends BaseRepo<Rate> {

}