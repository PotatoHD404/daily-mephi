import {Service} from "lib/injection/decorators/service.decorator";
import {inject} from "tsyringe";
import {MaterialsRepository} from "lib/api/materials/materials.repository";
import {Material} from "lib/api/materials/materials.entity";

@Service()
export class MaterialsService {
    constructor(private repository: MaterialsRepository) {
    }
}