import {Entity} from "lib/database/decorators/entity.decorator";
import {Types} from "ydb-sdk";
import {BaseEntity} from "lib/database/baseEntity";
import {Column} from "lib/database/decorators/column.decorators";
import {OneToOne} from "lib/database/decorators/oneToOne.decorator";
import {v4 as uuidV4 } from "uuid"

@Entity()
export class Comment extends BaseEntity {

    @Column(Types.UTF8, {primary: true})
    public id: string;

    @Column(Types.UTF8)
    public text: string;

    @Column(Types.DATETIME)
    public time: Date;

    @Column(Types.UINT64)
    public userId: number;

    @OneToOne(() => Comment)
    public parent: Comment | null;

    @Column(Types.UINT64)
    public reviewId: number;


    constructor({
                    id,
                    text,
                    time,
                    userId,
                    parent,
                    reviewId
                }: { id: string, text: string, time: Date, userId: number, parent: Comment | null, reviewId: number }) {
        super();
        this.id = id ?? uuidV4();
        this.text = text;
        this.time = time;
        this.userId = userId;
        this.parent = parent;
        this.reviewId = reviewId;
    }
}