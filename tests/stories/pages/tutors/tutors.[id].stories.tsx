import React from 'react';
import Tutor from 'pages/tutors/[id]';
import {Meta, StoryObj} from "@storybook/preact";

const meta: Meta<typeof Tutor> = {
    title: 'Pages/Tutor page',
    component: Tutor,
    argTypes: {
        needsAuth: {control: 'boolean'},
        isMobile: {control: 'boolean'},
        changeNeedsAuth: {action: 'changeNeedsAuth'},
    }
};

export default meta;
type Story = StoryObj<typeof Tutor>;

export const Primary: Story = {
    args: {
        changeNeedsAuth: (a: boolean) => {

        },
        needsAuth: false,
    }
};
