import {Tutor} from "lib/api/tutors/tutors.entity";
import {TutorsRepository} from "lib/api/tutors/tutors.repository";
import {Service} from "lib/injection/decorators/service.decorator";


@Service()
export class TutorsService {
    constructor(private repository: TutorsRepository) {
    }
}