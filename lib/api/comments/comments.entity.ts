import {Entity} from "../../decorators/db/entity.decorator";
import {declareType, Types} from "ydb-sdk";
import {BaseEntity} from "../../implementations/baseEntity";
import {Column} from "../../decorators/db/column.decorators";
import {ManyToMany} from "../../decorators/db/manyToMany.decorator";
import {OneToMany} from "../../decorators/db/oneToMany.decorator";
import {OneToOne} from "../../decorators/db/oneToOne.decorator";

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
export class Comment extends BaseEntity {


    constructor(id: number, text: string, time: Date, user: string, parent: string) {
        super();
        this.id = id;
        this.text = text;
        this.time = time;
        this.user = user;
        this.parent = parent;
    }

    @Column(Types.UINT64, {primary: true})
    private id: number;
    @Column(Types.STRING)
    private text: string;
    @Column(Types.DATETIME)
    private time: Date;
    @Column(Types.STRING)
    private user: string;
    @Column(Types.STRING)
    private parent: string;

    //TODO
    // @Column(Types.STRING)
    // private children: string[];
    // @Column(Types.STRING)
    // private next: string[];


}

// export interface Comment {
//     id: string,
//     text: string,
//     time: Date,
//     user: string
//     parent: string | null,
//     children: Array<string>,
//     next: Array<string>
// }