import {Tutor} from "lib/entities/tutor.entity";
import {TutorsRepository} from "lib/api/tutors/tutors.repository";
import {Service} from "lib/injection/decorators/service.decorator";


@Service()
export class TutorsService {
    constructor(private repository: TutorsRepository) {
    }

    async add(tutor: Tutor) : Promise<Tutor> {
        return Tutor.prototype;
    }
}