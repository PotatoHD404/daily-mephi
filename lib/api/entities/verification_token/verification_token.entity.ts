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
export class VerificationToken extends BaseEntity {


    constructor(identifier: string, token: number, timestamp: Date) {
        super();
        this.identifier = identifier;
        this.token = token;
        this.timestamp = timestamp;
    }

    @Column(Types.STRING, {primary: true})
    private identifier: string;
    @Column(Types.STRING)
    private token: number;
    @Column(Types.TIMESTAMP)
    private timestamp: Date;

}