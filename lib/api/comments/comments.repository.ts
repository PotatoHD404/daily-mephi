import {Repository} from "lib/decorators/repository.decorator";
import {Ydb} from "lib/database/db";
import {Repo} from "../../interfaces/repository";
import {Comment} from "./comments.entity"
import {string} from "prop-types";


@Repository()
export class CommentsRepository implements Repo<Comment> {
    constructor(database: Ydb) {
    }

    add(dto: Partial<Comment>): boolean {
        return false;
    }

    count(params: Partial<Comment>): number {
        return 0;
    }

    find(params: Partial<Comment>): Comment[] {
        return [];
    }

    findAndCount(params: Partial<Comment>): { count: number; entities: Comment[] } {
        return {count: 0, entities: []};
    }

    findOne(params: Partial<Comment>): Comment {
        return {
            id: "string",
            text: "string",
            time: new Date(),
            user: "string",
            parent: null,
            children: [],
            next: []
        };
    }

    remove(params: Partial<Comment>): boolean {
        return false;
    }

    update(params: Partial<Comment>): boolean {
        return false;
    }


}