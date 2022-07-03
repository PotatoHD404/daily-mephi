import {Entity} from "../database/decorators/entity.decorator";
import {BaseEntity} from "../database/baseEntity";
import {Column} from "../database/decorators/column.decorators";
import {Types} from "ydb-sdk";
import {ManyToMany} from "../database/decorators/manyToMany.decorator";
import {v4 as uuidV4} from "uuid";
import {OneToOne} from "../database/decorators/oneToOne.decorator";
import {Discipline, Faculty, Material, OldRating, Rate, Review} from ".";

@Entity()
export class Tutor extends BaseEntity {

    @Column(Types.UTF8, {primary: true})
    public id: string | null;

    @OneToOne(() => OldRating)
    public oldRating: OldRating;

    @ManyToMany(() => Rate)
    public rates: Rate[];

    @ManyToMany(() => Review)
    public reviews: Review[];

    @Column(Types.UTF8)
    public firstName: string | null;

    @Column(Types.UTF8)
    public lastName: string | null;

    @Column(Types.UTF8)
    public fatherName: string | null;

    @Column(Types.UTF8)
    public nickName: string | null;

    // @ManyToMany(Photo)
    // public photos: Photo; // TODO: create photo model

    // @ManyToMany(Material)
    // public materials: Material // TODO: create material model

    // @ManyToMany(Image)
    // public images: Image[]; // TODO: create image model

    @Column(Types.UTF8)
    public url: string | null;

    @Column(Types.DATETIME)
    public updated: Date;

    @ManyToMany(() => Discipline)
    public disciplines: Discipline[];

    @ManyToMany(() => Faculty)
    public faculties: Faculty[];

    @ManyToMany(() => Material)
    public materials: Material[];


    constructor({
                    id = uuidV4(),
                    oldRating,
                    rates,
                    reviews,
                    firstName,
                    lastName,
                    fatherName,
                    nickName,
                    url,
                    updated,
                    disciplines,
                    faculties,
                    materials
                }: {
        id?: string | null,
        oldRating: OldRating,
        rates?: Rate[],
        reviews?: Review[],
        firstName: string | null,
        lastName: string | null,
        fatherName: string | null,
        nickName: string | null,
        url: string | null,
        updated?: Date,
        disciplines?: Discipline[],
        faculties?: Faculty[],
        materials?: Material[]
    }) {
        super();
        this.id = id;
        this.oldRating = oldRating;
        this.rates = rates ?? [];
        this.reviews = reviews ?? [];
        this.firstName = firstName;
        this.lastName = lastName;
        this.fatherName = fatherName;
        this.nickName = nickName;
        this.url = url;
        this.updated = updated ?? new Date();
        this.disciplines = disciplines ?? [];
        this.faculties = faculties ?? [];
        this.materials = materials ?? [];
        // this.images = images ?? [];
    }
}