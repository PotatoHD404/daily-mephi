import {Rate} from "lib/entities/rate.entity";
import {RatesRepository} from "lib/api/rates/rates.repository";
import {Service} from "lib/injection/decorators/service.decorator";


@Service()
export class RatesService {
    constructor(private repository: RatesRepository) {
    }
}