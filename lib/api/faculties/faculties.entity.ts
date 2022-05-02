import {BaseEntity} from "lib/database/baseEntity";
import {Column} from "lib/database/decorators/column.decorators";
import {Entity} from "lib/database/decorators/entity.decorator";
import {Types} from "ydb-sdk";
import {v4 as uuidV4} from "uuid"

@Entity()
export class Faculty extends BaseEntity {

    @Column(Types.STRING, {primary: true})
    public id: string
    @Column(Types.UTF8)
    public name: string;

    constructor({id, name}: { id?: string, name: string }) {
        id = id ?? uuidV4();
        super({id, name});
        this.id = id;
        this.name = name;
    }

}