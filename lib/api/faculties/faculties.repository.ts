import {Faculty} from "lib/api/faculties/faculties.entity";
import {BaseRepo} from "lib/database/baseRepo";
import {Repository} from "lib/database/decorators/repository.decorator";

@Repository(Faculty)
export class FacultiesRepository extends BaseRepo<Faculty> {

}