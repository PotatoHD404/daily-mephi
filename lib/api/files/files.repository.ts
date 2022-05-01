import {File} from "lib/api/files/files.entity";
import {BaseRepo} from "lib/database/baseRepo";
import {Repository} from "lib/database/decorators/repository.decorator";

@Repository(File)
export class FilesRepository extends BaseRepo<File> {

}