import React from 'react';
import About from 'pages/about';
import {Meta, StoryObj} from "@storybook/preact";

const meta: Meta<typeof About> = {
    title: 'Pages/About page',
    component: About,
    argTypes: {
        needsAuth: {control: 'boolean'},
        isMobile: {control: 'boolean'},
        changeNeedsAuth: {action: 'changeNeedsAuth'},
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
