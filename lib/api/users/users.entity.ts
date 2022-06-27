import {Entity} from "lib/database/decorators/entity.decorator";
import {BaseEntity} from "lib/database/baseEntity";
import {Column} from "lib/database/decorators/column.decorators";
import {Types} from "ydb-sdk";
import {v4 as uuidV4} from "uuid";

@Entity()
export class User extends BaseEntity {


    @Column(Types.UTF8, {primary: true})
    public id: string | null;
    @Column(Types.UTF8)
    public image: string;
    @Column(Types.DATETIME)
    public joined: Date;
    @Column(Types.UTF8)
    public name: string;
    @Column(Types.UTF8)
    public role: string;
    @Column(Types.UINT64)
    public rating: number;

    constructor({
                    id = uuidV4(),
                    image,
                    joined,
                    name,
                    role,
                    rating
                }: { id?: string | null, image: string, joined: Date, name: string, role: string, rating: number }) {
        super();
        this.id = id;
        this.image = image;
        this.joined = joined;
        this.name = name;
        this.role = role;
        this.rating = rating;
    }

}
