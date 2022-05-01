import {Entity} from "lib/database/decorators/entity.decorator";
import {BaseEntity} from "lib/database/baseEntity";
import {Column} from "lib/database/decorators/column.decorators";
import {Types} from "ydb-sdk";
import {OneToMany} from "lib/database/decorators/oneToMany.decorator";
import {Comment} from "lib/api/comments/comments.entity";
import {ManyToMany} from "lib/database/decorators/manyToMany.decorator";
import {User} from "../users/users.entity";
import {OldRating, Rate} from "lib/entities";
import {OneToOne} from "lib/database/decorators/oneToOne.decorator";

@Entity()
export class Review extends BaseEntity {

    @Column(Types.UINT64, {primary: true})
    public id: number;

    @Column(Types.STRING)
    public body: string;

    @Column(Types.STRING)
    public header: string;

    @Column(Types.DATETIME)
    public time: Date;

    @Column(Types.STRING)
    public tutor: string;

    @Column(Types.STRING)
    public user: string;

    @OneToOne(OldRating)
    public oldRating: OldRating;

    @ManyToMany(Rate)
    public rates: Rate[];

    @OneToMany(Comment, "reviewId")
    public comments: Comment[];

    @ManyToMany(User)
    public dislikes: User[];

    @ManyToMany(User)
    public likes: User[];


    constructor(id: number, body: string, header: string, time: Date, tutor: string, user: string, oldRating: OldRating, rates: Rate[], comments: Comment[], dislikes: User[], likes: User[]) {
        super();
        this.id = id;
        this.body = body;
        this.header = header;
        this.time = time;
        this.tutor = tutor;
        this.user = user;
        this.oldRating = oldRating;
        this.rates = rates;
        this.comments = comments;
        this.dislikes = dislikes;
        this.likes = likes;
    }
}
