// import {Service as Repository} from "./service.decorator"
import {autoInjectable, singleton} from "tsyringe";

export function Repository(entity: any): ClassDecorator {

    return (target: any) => {
        target = autoInjectable()(target);
        singleton()(target);
    };
}