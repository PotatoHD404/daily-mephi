import {Service} from "lib/decorators/injection/service.decorator";
import {inject} from "tsyringe";
import {Material} from "./materials.entity";

@Service()
export class MaterialsService {
    constructor(@inject(Material) private materials: Material) {
    }
}