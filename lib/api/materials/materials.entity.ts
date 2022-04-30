import {Entity} from "../../decorators/db/entity.decorator";
import {declareType, Types} from "ydb-sdk";
import {BaseEntity} from "../../implementations/baseEntity";
import {Column} from "../../decorators/db/column.decorators";
import {ManyToMany} from "../../decorators/db/manyToMany.decorator";
import {OneToMany} from "../../decorators/db/oneToMany.decorator";
import {OneToOne} from "../../decorators/db/oneToOne.decorator";
import {string} from "prop-types";

@Entity()
class TestTable extends BaseEntity {
    constructor(id: number) {
        super();
        this.id = id;
    }

    @Column(Types.UINT64, {primary: true})
    private id: number;
}

@Entity()
export class Material extends BaseEntity {


    constructor(id: number, block: string, description: string, discipline: string, faculty: number, header: number, time: Date, tutor: string, url: string, user: string) {
        super();
        this.id = id;
        this.block = block;
        this.description = description;
        this.discipline = discipline;
        this.faculty = faculty;
        this.header = header;
        this.time = time;
        this.tutor = tutor;
        this.url = url;
        this.user = user;
    }

    @Column(Types.UINT64, {primary: true})
    private id: number;
    @Column(Types.STRING)
    private block: string;
    @Column(Types.STRING)
    private description: string;
    @Column(Types.STRING)
    private discipline: string;
    @Column(Types.STRING)
    private faculty: number;
    @Column(Types.STRING)
    private header: number;
    @Column(Types.DATETIME)
    private time: Date;
    @Column(Types.STRING)
    private tutor: string;
    @Column(Types.STRING)
    private url: string;
    @Column(Types.STRING)
    private user: string;
    //TODO
    // @Column(Types.STRING)
    // private comments: string[];
    // @Column(Types.STRING)
    // private dislikes: string[];
    // @Column(Types.STRING)
    // private likes: string[];




    // @ManyToMany(TestTable)
    // private tests: TestTable[];
    //
    // @OneToMany(TestTable, "id")
    // private tests1: TestTable[];
    //
    // @OneToOne(TestTable)
    // private tests2: TestTable;

}

// export interface Material {
//     id: string,
//     block: string | null
//     comments: Array<string>,
//     description: string,
//     discipline: string,
//     dislikes: Array<string>
//     faculty: string | null,
//     header: string
//     likes: Array<string>,
//     time: Date,
//     tutor: string | null,
//     url: string | null,
//     user: string
// }