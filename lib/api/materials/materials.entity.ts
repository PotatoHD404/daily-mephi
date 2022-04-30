import {Entity} from "../../decorators/db/entity.decorator";
import {declareType, Types} from "ydb-sdk";
import {BaseEntity} from "../../implementations/baseEntity";
import {Column} from "../../decorators/db/column.decorators";
import {ManyToMany} from "../../decorators/db/manyToMany.decorator";
import {OneToMany} from "../../decorators/db/oneToMany.decorator";
import {OneToOne} from "../../decorators/db/oneToOne.decorator";
import {string} from "prop-types";
import {User} from "../users/users.entity";
import {Comment} from "lib/api/comments/comments.entity"

@Entity()
export class Material extends BaseEntity {

    @Column(Types.UINT64, {primary: true})
    public id: number;

    @Column(Types.STRING)
    public block: string;

    @Column(Types.STRING)
    public description: string;

    @Column(Types.STRING)
    public discipline: string;

    @Column(Types.STRING)
    public faculty: number;

    @Column(Types.STRING)
    public header: number;

    @Column(Types.DATETIME)
    public time: Date;

    @Column(Types.STRING)
    public tutor: string;

    @Column(Types.STRING)
    public url: string;

    @Column(Types.STRING)
    public user: string;

    @OneToMany(Comment, "reviewId")
    public comments: Comment[];

    @ManyToMany(User)
    public dislikes: User[];

    @ManyToMany(User)
    public likes: User[];

    constructor(id: number, block: string, description: string, discipline: string, faculty: number, header: number, time: Date, tutor: string, url: string, user: string, comments: Comment[], dislikes: User[], likes: User[]) {
        super();
        this.id = id;
        this.block = block;
        this.description = description;
        this.discipline = discipline;
        this.faculty = faculty;
        this.header = header;
        this.time = time;
        this.tutor = tutor;
        this.url = url;
        this.user = user;
        this.comments = comments;
        this.dislikes = dislikes;
        this.likes = likes;
    }
}

// export interface Material {
//     id: string,
//     block: string | null
//     comments: Array<string>,
//     description: string,
//     discipline: string,
//     dislikes: Array<string>
//     faculty: string | null,
//     header: string
//     likes: Array<string>,
//     time: Date,
//     tutor: string | null,
//     url: string | null,
//     user: string
// }