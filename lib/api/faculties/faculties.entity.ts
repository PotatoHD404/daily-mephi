import {BaseEntity} from "lib/database/baseEntity";
import {Column} from "lib/database/decorators/column.decorators";
import {Entity} from "lib/database/decorators/entity.decorator";
import {Types} from "ydb-sdk";

@Entity()
export class Faculty extends BaseEntity {

    @Column(Types.UINT64, {primary: true})
    public id: number | null
    @Column(Types.STRING)
    public name: string;

    constructor({id, name}: { id?: number, name: string }) {
        super();
        this.id = id ?? null;
        this.name = name;
    }

}