import {User} from "lib/entities/user.entity";
import {UsersRepository} from "lib/api/users/users.repository";
import {Service} from "lib/injection/decorators/service.decorator";


@Service()
export class UsersService {
    constructor(private repository: UsersRepository) {
    }
}