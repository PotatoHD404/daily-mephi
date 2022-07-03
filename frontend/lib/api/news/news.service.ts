import {News} from "lib/entities/news.entity";
import {NewsRepository} from "lib/api/news/news.repository";
import {Service} from "lib/injection/decorators/service.decorator";


@Service()
export class NewsService {
    constructor(private repository: NewsRepository) {
    }
}