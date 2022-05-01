import {Entity} from "lib/database/decorators/entity.decorator";
import {BaseEntity} from "lib/database/baseEntity";
import {Column} from "lib/database/decorators/column.decorators";
import {Index} from "lib/database/decorators/index.decorator";
import {Types} from "ydb-sdk";
import {OneToOne} from "lib/database/decorators/oneToOne.decorator";
import {User} from "lib/api/users/users.entity";

@Entity()
export class Session extends BaseEntity {

    @Column(Types.UINT64, {primary: true})
    public id: number;

    @Column(Types.TIMESTAMP)
    public expires: Date;

    @Column(Types.STRING)
    public sessionToken: string;

    @Index()
    @Column(Types.STRING)
    public accessToken: string;

    @Column(Types.TIMESTAMP)
    public createdAt: Date;

    @Column(Types.TIMESTAMP)
    public updatedAt: Date;

    @OneToOne(User)
    public user: User;


    constructor(id: number, expires: Date, sessionToken: string, accessToken: string, createdAt: Date, updatedAt: Date, user: User) {
        super();
        this.id = id;
        this.expires = expires;
        this.sessionToken = sessionToken;
        this.accessToken = accessToken;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.user = user;
    }
}