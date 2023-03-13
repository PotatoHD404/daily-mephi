import React from 'react';
import Review from 'pages/reviews/[id]';
import {Meta, StoryObj} from "@storybook/preact";

const meta: Meta<typeof Review> = {
    title: 'Pages/Review page',
    component: Review,
    argTypes: {
        needsAuth: {control: 'boolean'},
        isMobile: {control: 'boolean'},
        changeNeedsAuth: {action: 'changeNeedsAuth'},
    }
};

export default meta;
type Story = StoryObj<typeof Review>;

export const Primary: Story = {
    args: {
        changeNeedsAuth: (a: boolean) => {

        },
        needsAuth: false,
    }
};
