import React from 'react';
import Page500 from 'pages/500';
import {Meta, StoryObj} from "@storybook/react";

const meta: Meta<typeof Page500> = {
    title: 'Pages/Page 500',
    component: Page500,
    argTypes: {
        needsAuth: {control: 'boolean'},
        isMobile: {control: 'boolean'},
        changeNeedsAuth: {action: 'changeNeedsAuth'},
    }
};

export default meta;
type Story = StoryObj<typeof Page500>;

export const Primary: Story = {
    args: {
        changeNeedsAuth: (a: boolean) => {

        },
        needsAuth: false,
    }
};
