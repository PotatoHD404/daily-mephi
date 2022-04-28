import {Repository} from "lib/decorators/repository.decorator";
import {DB} from "lib/database/db";
import {IRepo} from "../../interfaces/repo.interface";
import {Comment} from "./comments.entity"
import {string} from "prop-types";


@Repository()
export class CommentsRepository implements IRepo<Comment> {
    constructor(private db: DB) {
    }

    async find(params: Partial<Comment>): Promise<Comment[]> {
        const query = `SELECT * FROM `;
        // console.log(await this.db.query(query));
        await this.db.query(query)
        return Promise.resolve([]);
    }

    add(dto: Partial<Comment>): Promise<boolean> {
        return Promise.resolve(false);
    }

    count(params: Partial<Comment>): Promise<number> {
        return Promise.resolve(0);
    }

    findAndCount(params: Partial<Comment>): Promise<{ count: number; entities: Comment[] }> {
        return Promise.resolve({count: 0, entities: []});
    }

    findOne(params: Partial<Comment>): Promise<Comment> {
        return Promise.resolve({
            id: "string",
            text: "string",
            time: new Date(),
            user: "string",
            parent: null,
            children: [],
            next: []
        });
    }

    remove(params: Partial<Comment>): Promise<boolean> {
        return Promise.resolve(false);
    }

    update(params: Partial<Comment>): Promise<boolean> {
        return Promise.resolve(false);
    }

}