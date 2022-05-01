import {Entity} from "../../database/decorators/entity.decorator";
import {BaseEntity} from "../../database/baseEntity";
import {Column} from "../../database/decorators/column.decorators";
import {Types} from "ydb-sdk";

@Entity()
export class User extends BaseEntity {


    @Column(Types.UINT64, {primary: true})
    public id: number;
    @Column(Types.STRING)
    public image: string;
    @Column(Types.DATETIME)
    public joined: Date;
    @Column(Types.STRING)
    public name: string;
    @Column(Types.STRING)
    public role: string;
    @Column(Types.UINT64)
    public rating: number;

    constructor(id: number, image: string, joined: Date, name: string, role: string, rating: number) {
        super();
        this.id = id;
        this.image = image;
        this.joined = joined;
        this.name = name;
        this.role = role;
        this.rating = rating;
    }

}
