import {string} from "prop-types";
import {Entity} from "../../decorators/db/entity.decorator";
import {BaseEntity} from "../../implementations/baseEntity";
import {Column} from "../../decorators/db/column.decorators";
import {Types} from "ydb-sdk";
import {OneToMany} from "../../decorators/db/oneToMany.decorator";
import {Comment} from "lib/api/comments/comments.entity"

@Entity()
export class News extends BaseEntity {

    @Column(Types.UINT64, {primary: true})
    public id: number;

    @Column(Types.STRING)
    public body: string;

    @Column(Types.STRING)
    public header: string;

    @Column(Types.DATETIME)
    public time: Date;

    @OneToMany(Comment, "reviewId")
    public comments: Comment[];


    constructor(id: number, body: string, header: string, time: Date, comments: Comment[]) {
        super();
        this.id = id;
        this.body = body;
        this.header = header;
        this.time = time;
        this.comments = comments;
    }

}

// export interface News {
//     id: string,
//     body: string,
//     comments: Array<string>,
//     header: string,
//     time: Date
// }