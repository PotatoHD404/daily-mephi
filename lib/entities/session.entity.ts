import {Entity} from "../database/decorators/entity.decorator";
import {BaseEntity} from "../database/baseEntity";
import {Column} from "../database/decorators/column.decorators";
import {Types} from "ydb-sdk";
import {OneToOne} from "../database/decorators/oneToOne.decorator";
import {User} from "../api/users/users.entity";

@Entity()
export class Session extends BaseEntity {

    @Column(Types.UINT64, {primary: true})
    public id: number;

    @Column(Types.TIMESTAMP)
    public expires: Date;

    @Column(Types.STRING)
    public sessionToken: string;

    @OneToOne(User)
    public user: User;


    constructor(id: number, expires: Date, sessionToken: string, user: User) {
        super();
        this.id = id;
        this.expires = expires;
        this.sessionToken = sessionToken;
        this.user = user;
    }
}