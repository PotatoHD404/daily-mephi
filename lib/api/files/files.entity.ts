import {Entity} from "../../database/decorators/entity.decorator";
import {BaseEntity} from "../../database/baseEntity";
import {Column} from "../../database/decorators/column.decorators";
import {Types} from "ydb-sdk";

@Entity()
export class File extends BaseEntity {


    @Column(Types.UINT64, {primary: true})
    public id: number;
    @Column(Types.STRING)
    public url: String;

    constructor(id: number, url: String) {
        super();
        this.id = id;
        this.url = url;
    }
}