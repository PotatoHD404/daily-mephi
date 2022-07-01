import {Entity} from "lib/database/decorators/entity.decorator";
import {BaseEntity} from "lib/database/baseEntity";
import {Column} from "lib/database/decorators/column.decorators";
import {Types} from "ydb-sdk";
import {OneToMany} from "lib/database/decorators/oneToMany.decorator";
import {Comment} from "."
import {v4 as uuidV4} from "uuid";

@Entity()
export class News extends BaseEntity {

    @Column(Types.UTF8, {primary: true})
    public id: string | null;

    @Column(Types.UTF8)
    public body: string;

    @Column(Types.UTF8)
    public header: string;

    @Column(Types.DATETIME)
    public time: Date;

    @OneToMany(() => Comment, "reviewId")
    public comments: Comment[];


    constructor({
                    id = uuidV4(),
                    body,
                    header,
                    time,
                    comments
                }: { id?: string | null, body: string, header: string, time: Date, comments: Comment[] }) {
        super();
        this.id = id;
        this.body = body;
        this.header = header;
        this.time = time;
        this.comments = comments;
    }

}
