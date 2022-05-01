import {Faculty} from "lib/api/faculties/faculties.entity";
import {FacultiesRepository} from "lib/api/faculties/faculties.repository";
import {Service} from "lib/injection/decorators/service.decorator";


@Service()
export class FacultiesService {
    constructor(private repository: FacultiesRepository) {

    }

    getAll() {
        return this.repository.add(new Faculty({name: "ИИКС"}))
    }

}