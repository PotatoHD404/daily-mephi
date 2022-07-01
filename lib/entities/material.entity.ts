import {Entity} from "lib/database/decorators/entity.decorator";
import {Types} from "ydb-sdk";
import {BaseEntity} from "lib/database/baseEntity";
import {Column} from "lib/database/decorators/column.decorators";
import {ManyToMany} from "lib/database/decorators/manyToMany.decorator";
import {OneToMany} from "lib/database/decorators/oneToMany.decorator";
import {v4 as uuidV4} from "uuid";
import {User, Comment} from ".";

@Entity()
export class Material extends BaseEntity {

    @Column(Types.UTF8, {primary: true})
    public id: string | null;

    @Column(Types.UTF8)
    public block: string;

    @Column(Types.UTF8)
    public description: string;

    @Column(Types.UTF8)
    public discipline: string;

    @Column(Types.UTF8)
    public faculty: number;

    @Column(Types.UTF8)
    public header: number;

    @Column(Types.DATETIME)
    public time: Date;

    @Column(Types.UTF8)
    public tutor: string;

    @Column(Types.UTF8)
    public url: string;

    @Column(Types.UTF8)
    public user: string;

    @OneToMany(() => Comment, "reviewId")
    public comments: Comment[] | undefined;

    @ManyToMany(() => User)
    public dislikes: User[] | undefined;

    @ManyToMany(() => User)
    public likes: User[] | undefined;

    constructor({
                    id = uuidV4(),
                    block,
                    description,
                    discipline,
                    faculty,
                    header,
                    time,
                    tutor,
                    url,
                    user,
                    comments,
                    dislikes,
                    likes
                }: { id: string | null, block: string, description: string, discipline: string, faculty: number, header: number, time: Date, tutor: string, url: string, user: string, comments?: Comment[], dislikes?: User[], likes?: User[] }) {
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
