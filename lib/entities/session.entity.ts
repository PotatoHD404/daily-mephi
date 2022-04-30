import {Entity} from "../decorators/db/entity.decorator";
import {BaseEntity} from "../implementations/baseEntity";
import {Column} from "../decorators/db/column.decorators";
import {Types} from "ydb-sdk";
import {OneToOne} from "../decorators/db/oneToOne.decorator";
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