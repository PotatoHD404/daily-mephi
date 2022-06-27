import {Comment} from "lib/api/comments/comments.entity";
import {Rate} from "lib/api/rates/rates.entity";
import {OldRating} from "lib/api/tutors/oldRating.entity";
import {BaseEntity} from "lib/database/baseEntity";
import {Column} from "lib/database/decorators/column.decorators";
import {Entity} from "lib/database/decorators/entity.decorator";
import {ManyToMany} from "lib/database/decorators/manyToMany.decorator";
import {OneToMany} from "lib/database/decorators/oneToMany.decorator";
import {OneToOne} from "lib/database/decorators/oneToOne.decorator";
import {Types} from "ydb-sdk";
import {User} from "../users/users.entity";
import {v4 as uuidV4} from "uuid";
import {Tutor} from "../tutors/tutors.entity";

@Entity()
export class Review extends BaseEntity {

    @Column(Types.UTF8, {primary: true})
    public id: string | null;

    @Column(Types.UTF8)
    public body: string;

    @Column(Types.UTF8)
    public header: string;

    @Column(Types.DATETIME)
    public time: Date;

    @OneToMany(Tutor)
    public tutor: Tutor;

    @OneToMany(User)
    public user: User;

    @OneToMany(Comment, "reviewId")
    public comments: Comment[];

    @ManyToMany(User)
    public dislikes: User[];

    @ManyToMany(User)
    public likes: User[];


    constructor({
                    id = uuidV4(),
                    body,
                    header,
                    time,
                    tutor,
                    user,
                    comments,
                    dislikes,
                    likes
                }: { id?: string | null, body: string, header: string, time: Date, tutor: Tutor, user: User, comments: Comment[], dislikes: User[], likes: User[] }) {
        super();
        this.id = id;
        this.body = body;
        this.header = header;
        this.time = time;
        this.tutor = tutor;
        this.user = user;
        this.comments = comments;
        this.dislikes = dislikes;
        this.likes = likes;
    }
}
