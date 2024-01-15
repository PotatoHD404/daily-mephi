import type {Meta, StoryObj} from '@storybook/react';

import {Review} from "components/reviews";
import {UserType} from "lib/database/types";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof Review> = {
    title: 'Components/Review',
    component: Review,
};

export default meta;
type Story = StoryObj<typeof Review>;

// export type ReviewType = {
//     id: string;
//     body: string;
//     header: string;
//     likes: number;
//     dislikes: number;
//     commentCount: number;
//     createdAt: Date;
//     legacyNickname?: string;
//     user?: UserType;
// }


export const Primary: Story = {
    args: {
        review: {
            id: '1',
            body: 'This is a review',
            header: 'This is a header',
            likes: 0,
            dislikes: 0,
            commentCount: 0,
            createdAt: new Date(),
            legacyNickname: 'Legacy nickname',
            user: {
                id: '1',
                // @ts-ignore
                url: 'Username',
                image: {
                    url: 'https://avatars.githubusercontent.com/u/1158253?v=4',
                }
            }
        }
    }
};
