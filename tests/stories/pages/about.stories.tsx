import React from 'react';
import About from 'pages/about';
import {Meta, StoryObj} from "@storybook/react";
// @ts-ignore
import {rest} from "msw";

const meta: Meta<typeof About> = {
    title: 'Pages/About page',
    component: About,
    argTypes: {
        needsAuth: {control: 'boolean'},
        isMobile: {control: 'boolean'},
        changeNeedsAuth: {action: 'changeNeedsAuth'},
    },
    parameters: {
        msw: {
            handlers: [
                // @ts-ignore
                rest.get('/api/v1/top', (req, res, ctx) => {
                    const users: any[] = [
                        {
                            id: '1',
                            nickname: 'John Doe',
                            rating: 10,
                            image: 'https://avatars.githubusercontent.com/u/1158253?v=4',
                        },
                        {
                            id: '2',
                            nickname: 'John Doe 1',
                            rating: 9,
                            image: 'https://avatars.githubusercontent.com/u/1158253?v=4',
                        },
                        {
                            id: '3',
                            nickname: 'John Doe 2',
                            rating: 8,
                            image: 'https://avatars.githubusercontent.com/u/1158253?v=4',
                        },
                        {
                            id: '4',
                            nickname: 'John Doe 3',
                            rating: 3,
                            image: 'https://avatars.githubusercontent.com/u/1158253?v=4',
                        }
                    ]
                    return res(
                        ctx.json(users)
                    )
                }),
            ]
        }
    }
};

export default meta;
type Story = StoryObj<typeof About>;

export const Primary: Story = {
    args: {
        changeNeedsAuth: (a: boolean) => {

        },
        needsAuth: false,
    }
};
