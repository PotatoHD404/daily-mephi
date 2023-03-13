import React from 'react';
import Quote from 'pages/quotes/[id]';
import {Meta, StoryObj} from "@storybook/preact";

const meta: Meta<typeof Quote> = {
    title: 'Pages/Quote page',
    component: Quote,
    argTypes: {
        needsAuth: {control: 'boolean'},
        isMobile: {control: 'boolean'},
        changeNeedsAuth: {action: 'changeNeedsAuth'},
    }
};

export default meta;
type Story = StoryObj<typeof Quote>;

export const Primary: Story = {
    args: {
        changeNeedsAuth: (a: boolean) => {

        },
        needsAuth: false,
    }
};
