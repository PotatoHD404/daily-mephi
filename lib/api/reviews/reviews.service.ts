import {Review} from "lib/api/reviews/reviews.entity";
import {ReviewsRepository} from "lib/api/reviews/reviews.repository";
import {Service} from "lib/injection/decorators/service.decorator";


@Service()
export class ReviewsService {
    constructor(private repository: ReviewsRepository) {
    }
}