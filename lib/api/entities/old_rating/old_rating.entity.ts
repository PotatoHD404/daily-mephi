import {Entity} from "../../../decorators/db/entity.decorator";
import {BaseEntity} from "../../../implementations/baseEntity";
import {Column} from "../../../decorators/db/column.decorators";
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
export class OldRating extends BaseEntity {


    constructor(id: number, character: number, count: number, exams: number, quality: number) {
        super();
        this.id = id;
        this.character = character;
        this.count = count;
        this.exams = exams;
        this.quality = quality;
    }

    @Column(Types.UINT64, {primary: true})
    private id: number;
    @Column(Types.UINT64)
    private character: number;
    @Column(Types.UINT64)
    private count: number;
    @Column(Types.UINT64)
    private exams: number;
    @Column(Types.UINT64)
    private quality: number;

}

// old_rating: {
//         character: number,
//         count: number
//         exams: number
//         quality: number
//     },