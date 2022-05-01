import {TypedData, Ydb} from "ydb-sdk";

export class BaseEntity extends TypedData {
    constructor() {
        super({});
    }

    public asTypedRow() {
        const value = this.getRowValue().items.reduce((previousValue: Ydb.IValue, currentValue: Ydb.IValue) => {
            return {...currentValue};
        }, {})
        console.log({...this.getRowType().structType.members[0]});
        return {
            type: {
                listType: {
                    item: {...this.getRowType().structType.members[0]}
                }
            },
            value: {
                items: value
            }
        }
    }
}