import React from 'react';
import User from 'pages/users/[id]';
import {Meta, StoryObj} from "@storybook/preact";

const meta: Meta<typeof User> = {
    title: 'Pages/User page',
    component: User,
    argTypes: {
        needsAuth: {control: 'boolean'},
        isMobile: {control: 'boolean'},
        changeNeedsAuth: {action: 'changeNeedsAuth'},
    }
};

export default meta;
type Story = StoryObj<typeof User>;

export const Primary: Story = {
    args: {
        changeNeedsAuth: (a: boolean) => {

        },
        needsAuth: false,
    }
};
