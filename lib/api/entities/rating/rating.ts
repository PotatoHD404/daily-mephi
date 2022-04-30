import {Entity} from "../../../decorators/db/entity.decorator";
import {BaseEntity} from "../../../implementations/baseEntity";
import {Column} from "../../../decorators/db/column.decorators";
import {Types} from "ydb-sdk";
import {string} from "prop-types";

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
export class Rating extends BaseEntity {


    constructor(id: number, punctuality: number, character: number, exams: number, quality: number, tutor: string, user: string) {
        super();
        this.id = id;
        this.punctuality = punctuality;
        this.character = character;
        this.exams = exams;
        this.quality = quality;
        this.tutor = tutor;
        this.user = user;
    }

    @Column(Types.UINT64, {primary: true})
    private id: number;
    @Column(Types.UINT64)
    private punctuality: number;
    @Column(Types.UINT64)
    private character: number;
    @Column(Types.UINT64)
    private exams: number;
    @Column(Types.UINT64)
    private quality: number;
    @Column(Types.STRING)
    private tutor: string;
    @Column(Types.STRING)
    private user: string;

}

// export interface Rating {
//     id: string,
//     punctuality: number,
//     character: number,
//     exams: number,
//     quality: number,
//     tutor: string,
//     user: string
// }