export type TutorType = {
    id: string,
    firstName: string | null,
    lastName: string | null,
    fatherName: string | null,
    disciplines: string[],
    updatedAt: Date,
    nickName: string | null,
    quality: number,
    exams: number,
    personality: number,
    punctuality: number,
    legacyRating: number | null,
    rating: number,
    reviewsCount: number,
    materialsCount: number,
    quotesCount: number,
    url: string | null,
    images: string[],
};


export type UserType = {
    id: string;
    name: string;
    image: { url: string };
}

export type ReviewType = {
    id: string;
    body: string;
    header: string;
    likes: number;
    dislikes: number;
    commentCount: number;
    createdAt: Date;
    legacyNickname?: string;
    user?: UserType;
}
