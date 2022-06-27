import {Entity} from "lib/database/decorators/entity.decorator";
import {BaseEntity} from "lib/database/baseEntity";
import {Column} from "lib/database/decorators/column.decorators";
import {Types} from "ydb-sdk";
import {OneToOne} from "lib/database/decorators/oneToOne.decorator";
import {User} from "lib/api/users/users.entity";
import {v4 as uuidV4} from "uuid";


@Entity()
export class Rate extends BaseEntity {

    @Column(Types.UTF8, {primary: true})
    public id: string | null;

    @Column(Types.UINT8)
    public punctuality: number;

    @Column(Types.UINT8)
    public personality: number;

    @Column(Types.UINT8)
    public exams: number;

    @Column(Types.UINT8)
    public quality: number;

    @Column(Types.UINT64)
    public tutorId: number;

    @OneToOne(User)
    public user: User;


    constructor({
                    id = uuidV4(),
                    punctuality,
                    character,
                    exams,
                    quality,
                    tutorId,
                    user
                }: { id?: string | null, punctuality: number, character: number, exams: number, quality: number, tutorId: number, user: User }) {
        super();
        this.id = id;
        this.punctuality = punctuality;
        this.personality = character;
        this.exams = exams;
        this.quality = quality;
        this.tutorId = tutorId;
        this.user = user;
    }
}