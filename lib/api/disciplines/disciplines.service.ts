import {Service} from "lib/injection/decorators/service.decorator";


@Service()
export class DisciplinesService {
    constructor() {
    }


    async addAll(param: { disciplines: string[] }) {
        return [];
    }
}