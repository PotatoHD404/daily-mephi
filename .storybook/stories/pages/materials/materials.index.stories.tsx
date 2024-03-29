import React from 'react';
import Materials from 'pages/materials';
import {Meta, StoryObj} from "@storybook/react";

const meta: Meta<typeof Materials> = {
    title: 'Pages/Materials page',
    component: Materials,
    argTypes: {
        needsAuth: {control: 'boolean'},
        isMobile: {control: 'boolean'},
        changeNeedsAuth: {action: 'changeNeedsAuth'},
    }
};

export default meta;
type Story = StoryObj<typeof Materials>;

export const Primary: Story = {
    args: {
        changeNeedsAuth: (a: boolean) => {

        },
        needsAuth: false,
    }
};
