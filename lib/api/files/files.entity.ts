import {Entity} from "../../decorators/db/entity.decorator";
import {BaseEntity} from "../../implementations/baseEntity";
import {Column} from "../../decorators/db/column.decorators";
import {Types} from "ydb-sdk";

@Entity()
export class File extends BaseEntity {


    constructor(id: number, url: String) {
        super();
        this.id = id;
        this.url = url;
    }

    @Column(Types.UINT64, {primary: true})
    public id: number;
    @Column(Types.STRING)
    public url: String;
}