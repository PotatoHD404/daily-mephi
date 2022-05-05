import {container, singleton} from "tsyringe";

export function Module() {

    return (target: new (...args: any[]) => any) => {
        container.reset();
        singleton()(target);
        return target;
    };
}