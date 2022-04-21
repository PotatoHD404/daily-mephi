import {autoInjectable, container, singleton} from "tsyringe";

export function Service() {

    return (target: new (...args: any[]) => any) => {
        target = autoInjectable()(target);
        singleton()(target);

        return target;
    };
}