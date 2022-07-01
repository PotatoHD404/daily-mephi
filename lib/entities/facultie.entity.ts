import {BaseEntity} from "lib/database/baseEntity";
import {Column} from "lib/database/decorators/column.decorators";
import {Entity} from "lib/database/decorators/entity.decorator";
import {Types} from "ydb-sdk";
import {v4 as uuidV4} from "uuid"

@Entity()
export class Faculty extends BaseEntity {

    @Column(Types.UTF8, {primary: true})
    public id: string | null
    @Column(Types.UTF8)
    public name: string | null;

    constructor({id = uuidV4(), name}: { id?: string | null, name: string | null }) {
        super();
        this.id = id;
        this.name = name;
    }

}