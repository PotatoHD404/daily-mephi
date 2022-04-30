import {Service} from "lib/decorators/injection/service.decorator";
import {inject} from "tsyringe";

@Service()
export class MaterialsService {
    constructor(@inject(Materials) private materials: Materials) {
    }
}