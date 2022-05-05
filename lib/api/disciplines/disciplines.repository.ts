import {Discipline} from "lib/api/disciplines/disciplines.entity";
import {BaseRepo} from "lib/database/baseRepo";
import {Repository} from "lib/database/decorators/repository.decorator";

@Repository(Discipline)
export class DisciplinesRepository extends BaseRepo<Discipline> {

}