// import {Service as Repository} from "./service.decorator"
import {autoInjectable, singleton} from "tsyringe";

export function Repository() {

    return (target: new (...args: any[]) => any) => {
        target = autoInjectable()(target);
        singleton()(target);

        return target;
    };
}