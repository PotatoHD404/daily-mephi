import {User} from "lib/entities";
import {BaseRepo} from "lib/database/baseRepo";
import {Repository} from "lib/database/decorators/repository.decorator";

@Repository(User)
export class UsersRepository extends BaseRepo<User> {

}