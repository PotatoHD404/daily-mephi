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
export class News extends BaseEntity {


    constructor(id: number, body: string, header: string, time: Date) {
        super();
        this.id = id;
        this.body = body;
        this.header = header;
        this.time = time;
    }

    @Column(Types.UINT64, {primary: true})
    private id: number;
    @Column(Types.STRING)
    private body: string;
    @Column(Types.STRING)
    private header: string;
    @Column(Types.DATETIME)
    private time: Date;
    //TODO
    // @Column(Types.STRING)
    // private comments: string[];

}

// export interface News {
//     id: string,
//     body: string,
//     comments: Array<string>,
//     header: string,
//     time: Date
// }