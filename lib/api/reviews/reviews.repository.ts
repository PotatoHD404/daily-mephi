import {Review} from "lib/api/reviews/reviews.entity";
import {BaseRepo} from "lib/database/baseRepo";
import {Repository} from "lib/database/decorators/repository.decorator";

@Repository(Review)
export class ReviewsRepository extends BaseRepo<Review> {

}