import type { Meta, StoryObj } from '@storybook/preact';

import User from "pages/users/[id]"

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof User> = {
    title: 'User page',
    component: User,
    tags: ['autodocs'],
    argTypes: {
        backgroundColor: {
            control: 'color',
        },
    },
};

export default meta;
type Story = StoryObj<typeof User>;
