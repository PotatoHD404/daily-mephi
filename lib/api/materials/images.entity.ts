import {Entity} from "lib/database/decorators/entity.decorator";
import {Types} from "ydb-sdk";
import {BaseEntity} from "lib/database/baseEntity";
import {Column} from "lib/database/decorators/column.decorators";
import {v4 as uuidV4} from "uuid";

@Entity()
export class Image extends BaseEntity {

    @Column(Types.UTF8, {primary: true})
    public id: string | null;

    @Column(Types.UTF8)
    public block: string;

    @Column(Types.UTF8)
    public url: string;

    constructor({
                    id = uuidV4(),
                    block,
                    url,
                }: { id?: string | null, block: string, url: string }) {
        super();
        this.id = id;
        this.block = block;
        this.url = url;

    }
}
