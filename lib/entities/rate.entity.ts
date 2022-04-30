import {Entity} from "../decorators/db/entity.decorator";
import {BaseEntity} from "../implementations/baseEntity";
import {Column} from "../decorators/db/column.decorators";
import {Types} from "ydb-sdk";
import {string} from "prop-types";
import {Tutor} from "../api/tutors/tutors.entity";
import {OneToOne} from "../decorators/db/oneToOne.decorator";
import {User} from "../api/users/users.entity";


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

// export interface Rating {
//     id: string,
//     punctuality: number,
//     character: number,
//     exams: number,
//     quality: number,
//     tutor: string,
//     user: string
// }