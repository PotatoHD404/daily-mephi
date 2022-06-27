import {Entity} from "lib/database/decorators/entity.decorator";
import {BaseEntity} from "lib/database/baseEntity";
import {Column} from "lib/database/decorators/column.decorators";
import {Types} from "ydb-sdk";
import {v4 as uuidV4} from "uuid";

@Entity()
export class OldRating extends BaseEntity {


    constructor({
                    id = uuidV4(),
                    personality,
                    personalityCount,
                    exams,
                    examsCount,
                    quality,
                    qualityCount
                }: { id?: string, personality: number, personalityCount: number, exams: number, examsCount: number, quality: number, qualityCount: number }) {
        super();
        this.id = id;
        this.personality = personality;
        this.personalityCount = personalityCount;
        this.exams = exams;
        this.examsCount = examsCount;
        this.quality = quality;
        this.qualityCount = qualityCount;
    }

    @Column(Types.UTF8, {primary: true})
    public id: string;
    @Column(Types.UINT64)
    public personality: number;
    @Column(Types.UINT64)
    public personalityCount: number;
    @Column(Types.UINT64)
    public exams: number;
    @Column(Types.UINT64)
    public examsCount: number;
    @Column(Types.UINT64)
    public quality: number;
    @Column(Types.UINT64)
    public qualityCount: number;



}