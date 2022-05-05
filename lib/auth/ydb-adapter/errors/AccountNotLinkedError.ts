// Thrown when an Email address is already associated with an account
// but the user is trying an oAuth account that is not linked to it.
import {UnknownError} from "lib/auth/ydb-adapter/errors/UnknownError";

export class AccountNotLinkedError extends UnknownError {
    constructor(message: string) {
        super(message)
        this.name = 'AccountNotLinkedError'
        this.message = message
    }
}