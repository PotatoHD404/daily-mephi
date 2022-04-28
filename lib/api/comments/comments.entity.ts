import {string} from "prop-types";

export interface Comment {
    id: string,
    text: string,
    time: Date,
    user: string
    parent: string | null,
    children: Array<string>,
    next: Array<string>
}