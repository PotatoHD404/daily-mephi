import {autoInjectable, container, singleton} from "tsyringe";

export function Service() {

    return <T>(target: new (...args: any[]) => T) : any => {
        target = autoInjectable()(target);
        singleton()(target);
        return target;
    };
}