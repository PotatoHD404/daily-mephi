import {Entity} from "../../decorators/entity.decorator";
import {declareType, Types} from "ydb-sdk";
import {BaseEntity} from "../../implementations/baseEntity";
import {Column, Index} from "../../decorators/column.decorators";

@Entity("materials1")
export class Materials extends BaseEntity {
    constructor(id: number, a: string, b: string) {
        super();
        this.id = id;
        this.a = a;
        this.b = b;
    }

    @Column({primary: true})
    private id: number;
    @Index()
    @Column({name: "baobab"})
    private a: string;
    @Index("a")
    @Column()
    private b: string;
    @Index()
    @Column()
    private ba: string;
    @Index()
    @Column()
    private bac: string;
}