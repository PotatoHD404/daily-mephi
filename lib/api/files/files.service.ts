import {File} from "lib/api/files/files.entity";
import {FilesRepository} from "lib/api/files/files.repository";
import {Service} from "lib/injection/decorators/service.decorator";


@Service()
export class FilesService {
    constructor(private repository: FilesRepository) {
    }
}