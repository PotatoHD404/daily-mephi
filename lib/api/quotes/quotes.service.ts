import {Quote} from "lib/entities/quote.entity";
import {QuotesRepository} from "lib/api/quotes/quotes.repository";
import {Service} from "lib/injection/decorators/service.decorator";


@Service()
export class QuotesService {
    constructor(private repository: QuotesRepository) {
    }
}