import {Entity} from "../../decorators/entity.decorator";
import {declareType, Types} from "ydb-sdk";
import {BaseEntity} from "../../implementations/baseEntity";
import {Column, Index, Primary} from "../../decorators/column.decorators";

@Entity()
export class Materials extends BaseEntity {

    @Column()
    @Primary()
    private id: number;
    @Index()
    @Column()
    private a: string;
    @Index("a")
    @Column()
    private b: string;
}