import React from 'react';
import Home from 'pages';
import {Meta, StoryObj} from "@storybook/preact";

const meta: Meta<typeof Home> = {
    title: 'Pages/Home page',
    component: Home,
    argTypes: {
        needsAuth: {control: 'boolean'},
        isMobile: {control: 'boolean'},
        changeNeedsAuth: {action: 'changeNeedsAuth'},
    }
};

export default meta;
type Story = StoryObj<typeof Home>;

export const Primary: Story = {
    args: {
        changeNeedsAuth: (a: boolean) => {

        },
        needsAuth: false,
    }
};
