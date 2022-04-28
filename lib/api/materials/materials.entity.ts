import {Entity} from "../../decorators/entity.decorator";
import {declareType, Types} from "ydb-sdk";
import {BaseEntity} from "../../implementations/baseEntity";
import {Column, Index, Primary} from "../../decorators/column.decorators";

@Entity()
export class Materials extends BaseEntity {
    constructor(id: number, a: string, b: string) {
        super();
        this.id = id;
        this.a = a;
        this.b = b;
    }

    @Column()
    @Primary()
    private id: number;
    @Index()
    @Column()
    private a: string;
    @Index("a")
    @Column()
    private b: string;
    @Index()
    @Column()
    private ba: string;
}