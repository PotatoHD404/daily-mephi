import {Entity} from "../../database/decorators/entity.decorator";
import {BaseEntity} from "../../database/baseEntity";
import {Column} from "../../database/decorators/column.decorators";
import {Types} from "ydb-sdk";
import {ManyToMany} from "../../database/decorators/manyToMany.decorator";
import {Discipline} from "../disciplines/disciplines.entity";
import {Faculty} from "../faculties/faculties.entity";
import {v4 as uuidV4} from "uuid";
import {OneToOne} from "../../database/decorators/oneToOne.decorator";
import {OldRating} from "./oldRating.entity";
import {Rate} from "../rates/rates.entity";
import {Review} from "../reviews/reviews.entity";

@Entity()
export class Tutor extends BaseEntity {

    @Column(Types.UTF8, {primary: true})
    public id: string | null;

    @OneToOne(OldRating)
    public oldRating: OldRating;

    @ManyToMany(Rate)
    public rates: Rate[];

    @ManyToMany(Review)
    public reviews: Review[];

    @Column(Types.UTF8)
    public name: string;

    @Column(Types.UTF8)
    public lastName: string;

    @Column(Types.UTF8)
    public fatherName: string;

    @Column(Types.UTF8)
    public nickName: string;

    // @ManyToMany(Photo)
    // public photos: Photo; // TODO: create photo model

    // @ManyToMany(Material)
    // public materials: Material // TODO: create material model

    @Column(Types.UTF8)
    public description: string;

    @Column(Types.UTF8)
    public image: string;

    @Column(Types.UTF8)
    public url: string;

    @Column(Types.DATETIME)
    public since: Date;

    @Column(Types.DATETIME)
    public updated: Date;

    @ManyToMany(Discipline)
    public disciplines: Discipline[];

    @ManyToMany(Faculty)
    public faculties: Faculty[];


    constructor({
                    id = uuidV4(),
                    oldRating,
                    rates,
                    reviews,
                    name,
                    lastName,
                    fatherName,
                    nickName,
                    description,
                    image,
                    url,
                    since,
                    updated,
                    disciplines,
                    faculties
                }: { id?: string | null, oldRating: OldRating, rates?: Rate[], reviews?: Review[], name: string, lastName: string, fatherName: string, nickName: string, description: string, image: string, url: string, since: Date, updated: Date, disciplines?: Discipline[], faculties?: Faculty[] }) {
        super();
        this.id = id;
        this.oldRating = oldRating;
        this.rates = rates ?? [];
        this.reviews = reviews ?? [];
        this.name = name;
        this.lastName = lastName;
        this.fatherName = fatherName;
        this.nickName = nickName;
        this.description = description;
        this.image = image;
        this.url = url;
        this.since = since;
        this.updated = updated;
        this.disciplines = disciplines ?? [];
        this.faculties = faculties ?? [];
    }
}