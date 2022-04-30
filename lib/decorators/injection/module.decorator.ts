import {Catch} from "@storyofams/next-api-decorators";
import {autoInjectable, container, singleton} from "tsyringe";
import {BASE_PATH_TOKEN} from "./controller.decorator";

export function Module() {

    return (target: new (...args: any[]) => any) => {
        container.reset();
        singleton()(target);
        return target;
    };
}