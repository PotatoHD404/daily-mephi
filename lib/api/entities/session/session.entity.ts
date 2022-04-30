import {Entity} from "../../../decorators/db/entity.decorator";
import {BaseEntity} from "../../../implementations/baseEntity";
import {Column} from "../../../decorators/db/column.decorators";
import {Types} from "ydb-sdk";

@Entity()
class TestTable extends BaseEntity {
    constructor(id: number) {
        super();
        this.id = id;
    }

    @Column(Types.UINT64, {primary: true})
    private id: number;
}

@Entity()
export class Session extends BaseEntity {


    constructor(id: number, expires: Date, sessionToken: string, userId: string) {
        super();
        this.id = id;
        this.expires = expires;
        this.sessionToken = sessionToken;
        this.userId = userId;
    }

    @Column(Types.UINT64, {primary: true})
    private id: number;
    @Column(Types.TIMESTAMP)
    private expires: Date;
    @Column(Types.STRING)
    private sessionToken: string;
    @Column(Types.STRING)
    private userId: string;


}