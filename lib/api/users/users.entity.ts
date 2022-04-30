import {string} from "prop-types";
import {Entity} from "../../decorators/db/entity.decorator";
import {BaseEntity} from "../../implementations/baseEntity";
import {Column} from "../../decorators/db/column.decorators";
import {Types} from "ydb-sdk";

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

}
