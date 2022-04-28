import {container, singleton} from "tsyringe";

export function Database() {

    return (target: new (...args: any[]) => any) => {
        singleton()(target);
        container.register(target, {useClass: target});

        return target;
    };
}