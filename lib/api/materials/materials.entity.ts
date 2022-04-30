import {Entity} from "../../decorators/db/entity.decorator";
import {declareType, Types} from "ydb-sdk";
import {BaseEntity} from "../../implementations/baseEntity";
import {Column} from "../../decorators/db/column.decorators";
import {ManyToMany} from "../../decorators/db/manyToMany.decorator";
import {OneToMany} from "../../decorators/db/oneToMany.decorator";
import {OneToOne} from "../../decorators/db/oneToOne.decorator";

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
export class Materials extends BaseEntity {


    constructor(employeeId: number, firstName: string, lastName: string, title: string, deptId: number, managerId: number, tests: TestTable[], tests1: TestTable[], tests2: TestTable) {
        super();
        this.employeeId = employeeId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.title = title;
        this.deptId = deptId;
        this.managerId = managerId;
        this.tests = tests;
        this.tests1 = tests1;
        this.tests2 = tests2;
    }

    @Column(Types.UINT64, {primary: true})
    private employeeId: number;
    @Column(Types.STRING)
    private firstName: string;
    @Column(Types.STRING)
    private lastName: string;
    @Column(Types.STRING)
    private title: string;
    @Column(Types.UINT64)
    private deptId: number;
    @Column(Types.UINT64)
    private managerId: number;
    @ManyToMany(TestTable)
    private tests: TestTable[];

    @OneToMany(TestTable, "id")
    private tests1: TestTable[];

    @OneToOne(TestTable)
    private tests2: TestTable;

}