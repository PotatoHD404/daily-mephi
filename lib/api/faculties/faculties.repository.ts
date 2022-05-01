import {Faculty} from "./faculties.entity";
import {BaseRepo} from "../../database/baseRepo";
import {Repository} from "../../database/decorators/repository.decorator";

@Repository(Faculty)
export class FacultiesRepository extends BaseRepo<Faculty> {

}