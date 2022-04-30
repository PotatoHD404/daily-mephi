import {string} from "prop-types";
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
export class Quote extends BaseEntity {


    constructor(id: number) {
        super();
        this.id = id;
    }

    @Column(Types.UINT64, {primary: true})
    private id: number;
    //TODO
    // @Column(Types.STRING)
    // private comments: string[];
    // @Column(Types.STRING)
    // private dislikes: string[];
    // @Column(Types.STRING)
    // private likes: string[];
}

// export interface Quote {
//     id: string,
//     comments: Array<string>,
//     dislikes: Array<string>
//     likes: Array<string>
// }