import {string} from "prop-types";
import {Entity} from "../../decorators/db/entity.decorator";
import {BaseEntity} from "../../implementations/baseEntity";
import {Column} from "../../decorators/db/column.decorators";
import {Types} from "ydb-sdk";
import {ManyToMany} from "../../decorators/db/manyToMany.decorator";
import {User} from "../users/users.entity";


@Entity()
export class Quote extends BaseEntity {

    @Column(Types.UINT64, {primary: true})
    public id: number;

    @ManyToMany(User)
    public dislikes: User[];

    @ManyToMany(User)
    public likes: User[];


    constructor(id: number, dislikes: User[], likes: User[]) {
        super();
        this.id = id;
        this.dislikes = dislikes;
        this.likes = likes;
    }
}

// export interface Quote {
//     id: string,
//     comments: Array<string>,
//     dislikes: Array<string>
//     likes: Array<string>
// }