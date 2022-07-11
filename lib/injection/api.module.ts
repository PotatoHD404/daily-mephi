import {
    BASE_PATH_TOKEN,
    container,
    getCallerInfo,
    getParams,
    HandlerMethod,
    HTTP_METHOD_TOKEN,
    InjectAll,
    Key,
    Module,
    NextApiHandler,
    NextApiRequest,
    NextApiResponse,
    notFound,
    parseRequestUrl,
    pathToRegexp
} from "lib/injection/injection.imports";
import {CONTROLLERS_TOKEN} from "lib/injection/decorators/controller.decorator";

@Module()
export class ApiModule {

    constructor(@InjectAll(CONTROLLERS_TOKEN) private controllers: any[]) {
    }

    getHandler(): NextApiHandler {


        return (req: NextApiRequest, res: NextApiResponse) => {
            if (!req.url || !req.method) {
                return notFound(req, res);
            }

            const path = req.url.replace("/api", "")

            for (let i = 0; i < this.controllers.length; ++i) {
                const [keys, match, method] = this.findRoute(this.controllers[i], req.method, path);

                if (!method)
                    continue;
                // console.log(this.controllers[i])
                const cls: any = container.resolve(this.controllers[i]);

                const methodFn = cls[method.propertyKey];
                if (!methodFn)
                    continue;

                // @ts-ignore
                req.params = getParams(keys, match);

                return methodFn.call(cls, req, res);
            }
            return notFound(req, res);


        };
    }

    findRoute(
        cls: Record<string, any>,
        verb: string,
        path: string
    ): [Key[], RegExpExecArray | null | undefined, HandlerMethod | undefined] {

        let methods: Array<HandlerMethod> = Reflect.getMetadata(HTTP_METHOD_TOKEN, cls);
        const basePath: string = Reflect.getMetadata(BASE_PATH_TOKEN, cls);
        if (!basePath)
            return [[], undefined, undefined];
        methods = methods.map(f => {
            // console.log((basePath + (f.path === "/" ? "" : f.path)).replace("//", "/"))
            return {
                ...f,
                path: (basePath + (f.path === "/" ? "" : f.path)).replace("//", "/")
            }
        })

        const keys: Key[] = [];
        let match: RegExpExecArray | null | undefined;
        const method = methods.find(f => {
            match = pathToRegexp(f.path, keys).exec(path);
            // console.log(path, f.path)
            const condition = f.verb === verb && match?.length;

            if (!condition) {
                keys.length = 0;
                match = undefined;
            }
            return condition;
        });

        return [keys, match, method];
    }
}