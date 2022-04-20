export function Test(): Function {
    return function (target: object | Function, propertyKey: string) {
        switch (typeof target) {
            case 'function': {
                console.log('Decorated function')
                break;
            }
            case 'object': {
                console.log('object')
                break;
            }
        }
    };
}