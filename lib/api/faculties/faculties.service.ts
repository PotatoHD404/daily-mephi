import {getTypedValue} from "helpers/utils";
import {Faculty} from "lib/entities/facultie.entity";
import {FacultiesRepository} from "lib/api/faculties/faculties.repository";
import {Service} from "lib/injection/decorators/service.decorator";
import {Types, Ydb} from "ydb-sdk";
import TypedValue = Ydb.TypedValue;


@Service()
export class FacultiesService {
    constructor(private repository: FacultiesRepository) {

    }

    async add(param: { faculty: string }): Promise<Faculty | null> {
        if (await this.repository.count({where: {name: getTypedValue(Types.UTF8, param.faculty)}}) === 0) {
            const faculty = new Faculty({name: param.faculty});
            await this.repository.add(faculty);
            return faculty;
        }
        return null;
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
        return await this.repository.findAll({});
    }

    async addAll(param: { faculties: string[] }): Promise<Faculty[]> {
        const faculties = param.faculties
            .filter(async el => await this.repository.count({where: {name: getTypedValue(Types.UTF8, el)}}) === 0)
            .map((el: any) => new Faculty({name: el}));
        await this.repository.addAll(faculties);
        return faculties;
    }
}