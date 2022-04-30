import {Entity} from "../../decorators/db/entity.decorator";
import {BaseEntity} from "../../implementations/baseEntity";
import {Column} from "../../decorators/db/column.decorators";
import {Types} from "ydb-sdk";

@Entity()
export class Faculty extends BaseEntity {

    constructor(id: number, name: string) {
        super();
        this.id = id;
        this.name = name;
    }

    @Column(Types.UINT64, {primary: true})
    public id: number;
    @Column(Types.STRING)
    public name: string;

}