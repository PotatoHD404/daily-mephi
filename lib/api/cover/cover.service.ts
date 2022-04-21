import {Service} from "typedi";

@Service({id: "test", multiple: true})
export class CoverService {
    print(){
        console.log("b")
    }
}