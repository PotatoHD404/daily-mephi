import {Delete, Param} from '@storyofams/next-api-decorators';
import {FilesService} from "lib/api/files/files.service";
import "lib/api/files/files.entity"


// import {checkStatus, doRequest, setCookie} from "helpers/utils";
import {Controller} from 'lib/injection/decorators/controller.decorator';

@Controller("/files")
class FilesController {

    constructor(private  service: FilesService) {
    }

    @Delete("/:id")
    public async delete(@Param('id') id: string) {

    }
}