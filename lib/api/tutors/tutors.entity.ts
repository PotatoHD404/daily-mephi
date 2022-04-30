import {string} from "prop-types";
import {Entity} from "../../decorators/db/entity.decorator";
import {BaseEntity} from "../../implementations/baseEntity";
import {Column} from "../../decorators/db/column.decorators";
import {Types} from "ydb-sdk";

@Entity()
class TestTable extends BaseEntity {
    constructor(id: number) {
        super();
        this.id = id;
    }

    @Column(Types.UINT64, {primary: true})
    private id: number;
}

@Entity()
export class Tutor extends BaseEntity {


    constructor(id: number, name: string, description: string, image: string, url: string, since: Date, updated: Date) {
        super();
        this.id = id;
        this.name = name;
        this.description = description;
        this.image = image;
        this.url = url;
        this.since = since;
        this.updated = updated;
    }

    @Column(Types.UINT64, {primary: true})
    private id: number;
    @Column(Types.STRING)
    private name: string;
    @Column(Types.STRING)
    private description: string;
    @Column(Types.DATETIME)
    private image: string;
    @Column(Types.DATETIME)
    private url: string;
    @Column(Types.DATETIME)
    private since: Date;
    @Column(Types.DATETIME)
    private updated: Date;
    //TODO
    // @Column(Types.STRING)
    // private disciplines: string[];
    // @Column(Types.STRING)
    // private parent faculties: string[];

}


// export interface Tutor {
//     id: string
//     name: string,
//     old_rating: {
//         character: number,
//         count: number
//         exams: number
//         quality: number
//     },
//     description: string,
//     image: string,
//     url: string,
//     since: Date,
//     updated: Date,
//     disciplines: Array<string>,
//     faculties: Array<string>
// }
