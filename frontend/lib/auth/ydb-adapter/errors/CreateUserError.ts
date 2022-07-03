import {UnknownError} from 'lib/auth/ydb-adapter/errors/UnknownError';

export class CreateUserError extends UnknownError {
    constructor(message?: string) {
        super(message)
        this.name = 'CreateUserError'
        this.message = message ?? ""
    }
}