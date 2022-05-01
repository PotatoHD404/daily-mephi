import {Service} from "lib/injection/decorators/service.decorator";
import {inject} from "tsyringe";
import {Material} from "lib/api/materials/materials.entity";

@Service()
export class MaterialsService {
    constructor(@inject(Material) private materials: Material) {
    }
}