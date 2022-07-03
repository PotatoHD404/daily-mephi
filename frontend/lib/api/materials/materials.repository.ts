import {Material} from "lib/entities";
import {BaseRepo} from "lib/database/baseRepo";
import {Repository} from "lib/database/decorators/repository.decorator";

@Repository(Material)
export class MaterialsRepository extends BaseRepo<Material> {

}