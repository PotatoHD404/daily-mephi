import {Service} from "lib/injection/decorators/service.decorator";


@Service()
export class ReviewsService {
    constructor() {
    }

    async addAll() {
        return [];
    }
}