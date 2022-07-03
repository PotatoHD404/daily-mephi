import {Faculty} from "lib/entities";
import {BaseRepo} from "lib/database/baseRepo";
import {Repository} from "lib/database/decorators/repository.decorator";

@Repository(Faculty)
export class FacultiesRepository extends BaseRepo<Faculty> {

}