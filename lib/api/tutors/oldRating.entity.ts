import {Entity} from "lib/database/decorators/entity.decorator";
import {BaseEntity} from "lib/database/baseEntity";
import {Column} from "lib/database/decorators/column.decorators";
import {Types} from "ydb-sdk";

@Entity()
export class OldRating extends BaseEntity {


    @Column(Types.UINT64, {primary: true})
    public id: number;
    @Column(Types.UINT64)
    public character: number;
    @Column(Types.UINT64)
    public count: number;
    @Column(Types.UINT64)
    public exams: number;
    @Column(Types.UINT64)
    public quality: number;

    constructor(id: number, character: number, count: number, exams: number, quality: number) {
        super();
        this.id = id;
        this.character = character;
        this.count = count;
        this.exams = exams;
        this.quality = quality;
    }

}