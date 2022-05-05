import {Entity} from "lib/database/decorators/entity.decorator";
import {BaseEntity} from "lib/database/baseEntity";
import {Column} from "lib/database/decorators/column.decorators";
import {Types} from "ydb-sdk";
import {OneToOne} from "lib/database/decorators/oneToOne.decorator";
import {User} from "lib/api/users/users.entity";


@Entity()
export class Rate extends BaseEntity {

    @Column(Types.UINT64, {primary: true})
    public id: number;

    @Column(Types.UINT8)
    public punctuality: number;

    @Column(Types.UINT8)
    public character: number;

    @Column(Types.UINT8)
    public exams: number;

    @Column(Types.UINT8)
    public quality: number;

    @Column(Types.UINT64)
    public tutorId: number;

    @OneToOne(User)
    public user: User;


    constructor(id: number, punctuality: number, character: number, exams: number, quality: number, tutorId: number, user: User) {
        super();
        this.id = id;
        this.punctuality = punctuality;
        this.character = character;
        this.exams = exams;
        this.quality = quality;
        this.tutorId = tutorId;
        this.user = user;
    }
}