import {Entity} from "lib/database/decorators/entity.decorator";
import {BaseEntity} from "lib/database/baseEntity";
import {Column} from "lib/database/decorators/column.decorators";
import {Types} from "ydb-sdk";
import {ManyToMany} from "lib/database/decorators/manyToMany.decorator";
import {User} from ".";
import {v4 as uuidV4} from "uuid";


@Entity()
export class Quote extends BaseEntity {

    @Column(Types.UTF8, {primary: true})
    public id: string | null;

    // @ManyToMany(User)
    // public dislikes: User[];
    //
    // @ManyToMany(User)
    // public likes: User[];


    constructor({id = uuidV4(), dislikes, likes}: { id?: string | null, dislikes: User[], likes: User[] }) {
        super();
        this.id = id;
        this.dislikes = dislikes;
        this.likes = likes;
    }
}