import {getTypedValue} from "helpers/utils";
import {Faculty} from "lib/api/faculties/faculties.entity";
import {FacultiesRepository} from "lib/api/faculties/faculties.repository";
import {Service} from "lib/injection/decorators/service.decorator";
import {Types} from "ydb-sdk";


@Service()
export class FacultiesService {
    constructor(private repository: FacultiesRepository) {

    }

    async add() {
        return await this.repository.add(new Faculty({name: "ИИКС"}))
    }

    async getAll() {
        // return await this.repository.findAll({
        //     where: [{
        //         firstName: getTypedValue(Types.UTF8, "TimBeR"),
        //         lastName: getTypedValue(Types.UTF8, "Saw")
        //     }, {firstName: getTypedValue(Types.UTF8, "TimBeR"), lastName: getTypedValue(Types.UTF8, "Saw")}],
        //     select: ["test", "test2"],
        //     order: {
        //         columnName: "ASC",
        //         columnName1: "DESC",
        //     },
        //     offset: 0,
        //     limit: 10,
        // });
        return await this.repository.findAll({
            where: [{
                name: getTypedValue(Types.UTF8, "ИИКС")
            }]
        });
    }

}