import {Tutor} from "lib/api/tutors/tutors.entity";
import {BaseRepo} from "lib/database/baseRepo";
import {Repository} from "lib/database/decorators/repository.decorator";

@Repository(Tutor)
export class TutorsRepository extends BaseRepo<Tutor> {

}