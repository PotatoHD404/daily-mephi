import {Entity} from "lib/database/decorators/entity.decorator";
import {BaseEntity} from "lib/database/baseEntity";
import {Column} from "lib/database/decorators/column.decorators";
import {Types} from "ydb-sdk";
import {ManyToMany} from "lib/database/decorators/manyToMany.decorator";
import {User} from "lib/api/users/users.entity";


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