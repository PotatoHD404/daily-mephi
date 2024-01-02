import type {Meta, StoryObj} from '@storybook/react';

import TopUsers from "components/topUsers"
// @ts-ignore
import {rest} from "msw";


// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof TopUsers> = {
    title: 'Components/Top Users',
    component: TopUsers,
    parameters: {
        msw: {
            handlers: [
                rest.get('/api/v1/top', (req: any, res: any, ctx: any) => {
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
type Story = StoryObj<typeof TopUsers>;

export const Primary: Story = {
    args: {
        isLoading: false,
    },

};
export const Loading: Story = {
    args: {
        isLoading: true,
    }
};
