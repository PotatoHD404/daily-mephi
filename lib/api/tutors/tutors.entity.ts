import {string} from "prop-types";
import {Entity} from "../../decorators/db/entity.decorator";
import {BaseEntity} from "../../implementations/baseEntity";
import {Column} from "../../decorators/db/column.decorators";
import {Types} from "ydb-sdk";
import {ManyToMany} from "../../decorators/db/manyToMany.decorator";
import {Discipline} from "../disciplines/disciplines.entity";
import {Faculty} from "../faculties/faculties.entity";

@Entity()
export class Tutor extends BaseEntity {

    @Column(Types.UINT64, {primary: true})
    public id: number;

    @Column(Types.STRING)
    public name: string;

    @Column(Types.STRING)
    public description: string;

    @Column(Types.STRING)
    public image: string;

    @Column(Types.STRING)
    public url: string;

    @Column(Types.DATETIME)
    public since: Date;

    @Column(Types.DATETIME)
    public updated: Date;

    @ManyToMany(Discipline)
    public disciplines: Discipline[];

    @ManyToMany(Faculty)
    public faculties: Faculty[];


    constructor(id: number, name: string, description: string, image: string, url: string, since: Date, updated: Date, disciplines: Discipline[], faculties: Faculty[]) {
        super();
        this.id = id;
        this.name = name;
        this.description = description;
        this.image = image;
        this.url = url;
        this.since = since;
        this.updated = updated;
        this.disciplines = disciplines;
        this.faculties = faculties;
    }
}