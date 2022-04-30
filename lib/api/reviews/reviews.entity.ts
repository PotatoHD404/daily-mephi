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
export class Review extends BaseEntity {


    constructor(id: number, body: string, header: string, time: Date, tutor: string, user: string) {
        super();
        this.id = id;
        this.body = body;
        this.header = header;
        this.time = time;
        this.tutor = tutor;
        this.user = user;
    }

    @Column(Types.UINT64, {primary: true})
    private id: number;
    @Column(Types.STRING)
    private body: string;
    @Column(Types.STRING)
    private header: string;
    @Column(Types.DATETIME)
    private time: Date;
    @Column(Types.STRING)
    private tutor: string;
    @Column(Types.STRING)
    private user: string;
    //TODO
    // @Column(Types.STRING)
    // private comments: string[];
    // @Column(Types.STRING)
    // private dislikes: string[];
    // @Column(Types.STRING)
    // private likes: string[];

}






// export interface Review {
//     id: string,
//     body: string,
//     comments: Array<string>,
//     dislikes: Array<string>,
//     header: string,
//     likes: Array<string>,
//     time: Date,
//     tutor: string,
//     user: string
// }