export class BaseError extends Error {
    constructor(name: string, message: Error | string) {
        if (typeof message !== "string") {
            message = message.message;
        }
        super(message)
        this.name = name
        this.message = message
    }

    toJSON() {
        return {
            error: {
                name: this.name,
                message: this.message,
                stack: this.stack
            }
        }
    }
}