import {Entity} from "lib/database/decorators/entity.decorator";
import {BaseEntity} from "lib/database/baseEntity";
import {Column} from "lib/database/decorators/column.decorators";
import {Types} from "ydb-sdk";
import {v4 as uuidV4} from "uuid";

@Entity()
export class Discipline extends BaseEntity {

    @Column(Types.UTF8, {primary: true})
    public id: string | null;
    @Column(Types.STRING)
    public name: string | null;

    constructor({id = uuidV4(), name}: { id?: string | null, name: string | null }) {
        super();
        this.id = id;
        this.name = name;
    }

}