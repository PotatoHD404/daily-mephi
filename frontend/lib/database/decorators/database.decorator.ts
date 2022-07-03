import {container, singleton} from "tsyringe";

export function Database(): ClassDecorator {

    return function (target: any) {
        singleton()(target);
        container.register(target, {useClass: target});

        return target;
    };
}