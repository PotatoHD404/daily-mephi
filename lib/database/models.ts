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

export interface Material {
    id: string,
    block: string | null
    comments: Array<string>,
    description: string,
    discipline: string,
    dislikes: Array<string>
    faculty: string | null,
    header: string
    likes: Array<string>,
    time: Date,
    tutor: string | null,
    url: string | null,
    user: string
}

export interface News {
    id: string,
    body: string,
    comments: Array<string>,
    header: string,
    time: Date
}

export interface Quote {
    id: string,
    comments: Array<string>,
    dislikes: Array<string>
    likes: Array<string>
}

export interface Rating {
    id: string,
    punctuality: number,
    character: number,
    exams: number,
    quality: number,
    tutor: string,
    user: string
}

export interface Review {
    id: string,
    body: string,
    comments: Array<string>,
    dislikes: Array<string>,
    header: string,
    likes: Array<string>,
    time: Date,
    tutor: string,
    user: string
}

export interface Tutor {
    id: string
    name: string,
    old_rating: {
        character: number,
        count: number
        exams: number
        quality: number
    },
    description: string,
    image: string,
    url: string,
    since: Date,
    updated: Date,
    disciplines: Array<string>,
    faculties: Array<string>
}

export interface User {
    image: string,
    joined: Date,
    name: string,
    role: "user" | "admin" | "tutor"
}
