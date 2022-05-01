import {Entity} from "lib/database/decorators/entity.decorator";
import {BaseEntity} from "lib/database/baseEntity";
import {Column} from "lib/database/decorators/column.decorators";
import {Types} from "ydb-sdk";

@Entity()
export class Discipline extends BaseEntity {

    @Column(Types.UINT64, {primary: true})
    public id: number;
    @Column(Types.STRING)
    public name: string;

    constructor(id: number, name: string) {
        super();
        this.id = id;
        this.name = name;
    }

}