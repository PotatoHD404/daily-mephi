import React from 'react';
import Search from 'pages/search';
import {Meta, StoryObj} from "@storybook/react";

const meta: Meta<typeof Search> = {
    title: 'Pages/Search page',
    component: Search,
    argTypes: {
        needsAuth: {control: 'boolean'},
        isMobile: {control: 'boolean'},
        changeNeedsAuth: {action: 'changeNeedsAuth'},
    }
};

export default meta;
type Story = StoryObj<typeof Search>;

export const Primary: Story = {
    args: {
        changeNeedsAuth: (a: boolean) => {

        },
        needsAuth: false,
    }
};
