import {Entity} from "lib/database/decorators/entity.decorator";
import {BaseEntity} from "lib/database/baseEntity";
import {Column} from "lib/database/decorators/column.decorators";
import {Types} from "ydb-sdk";

@Entity()
export class File extends BaseEntity {


    @Column(Types.UTF8, {primary: true})
    public id: number;
    @Column(Types.STRING)
    public url: String;

    constructor(id: number, url: String) {
        super();
        this.id = id;
        this.url = url;
    }
}