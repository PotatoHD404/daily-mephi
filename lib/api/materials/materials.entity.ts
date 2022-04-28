import {Entity} from "../../decorators/entity.decorator";
import {declareType, Types} from "ydb-sdk";
import {BaseEntity} from "../../implementations/baseEntity";

@Entity()
export class Materials extends BaseEntity {


    constructor(a: string, ab: string, b: string) {
        super();
        this.a = a;
        this.ab = ab;
        this.b = b;
    }

    @declareType(Types.STRING)
    private a: string;
    @declareType(Types.STRING)
    private ab: string;
    @declareType(Types.STRING)
    private b: string;
}