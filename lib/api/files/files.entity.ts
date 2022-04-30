import {Entity} from "../../decorators/db/entity.decorator";
import {BaseEntity} from "../../implementations/baseEntity";
import {Column} from "../../decorators/db/column.decorators";
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
export class File extends BaseEntity {


    constructor(id: number, url: String) {
        super();
        this.id = id;
        this.url = url;
    }

    @Column(Types.UINT64, {primary: true})
    private id: number;
    @Column(Types.STRING)
    private url: String;
}