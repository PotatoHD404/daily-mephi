import React from 'react';
import Page404 from 'pages/404';
import {Meta, StoryObj} from "@storybook/react";

const meta: Meta<typeof Page404> = {
    title: 'Pages/Page 404',
    component: Page404,
    argTypes: {
        needsAuth: {control: 'boolean'},
        isMobile: {control: 'boolean'},
        changeNeedsAuth: {action: 'changeNeedsAuth'},
    }
};

export default meta;
type Story = StoryObj<typeof Page404>;

export const Primary: Story = {
    args: {
        changeNeedsAuth: (a: boolean) => {

        },
        needsAuth: false,
    }
};
