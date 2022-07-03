import {Discipline} from "lib/entities";
import {BaseRepo} from "lib/database/baseRepo";
import {Repository} from "lib/database/decorators/repository.decorator";

@Repository(Discipline)
export class DisciplinesRepository extends BaseRepo<Discipline> {

}