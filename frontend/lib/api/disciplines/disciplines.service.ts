import {Discipline} from "lib/entities/discipline.entity";
import {DisciplinesRepository} from "lib/api/disciplines/disciplines.repository";
import {Service} from "lib/injection/decorators/service.decorator";


@Service()
export class DisciplinesService {
    constructor(private repository: DisciplinesRepository) {
    }


    async addAll(param: { disciplines: string[] }) {
        return [];
    }
}