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
export class User extends BaseEntity {


    constructor(id: number, image: string, joined: Date, name: string, role: string, rating: number) {
        super();
        this.id = id;
        this.image = image;
        this.joined = joined;
        this.name = name;
        this.role = role;
        this.rating = rating;
    }

    @Column(Types.UINT64, {primary: true})
    private id: number;
    @Column(Types.STRING)
    private image: string;
    @Column(Types.DATETIME)
    private joined: Date;
    @Column(Types.STRING)
    private name: string;
    @Column(Types.STRING)
    private role: string;
    @Column(Types.UINT64)
    private rating: number;

}


// export interface User {
//     image: string,
//     joined: Date,
//     name: string,
//     role: "user" | "admin" | "tutor"
// }