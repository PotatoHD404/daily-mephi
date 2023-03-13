import React from 'react';
import Tutors from 'pages/tutors';
import {Meta, StoryObj} from "@storybook/preact";

const meta: Meta<typeof Tutors> = {
    title: 'Pages/Tutors page',
    component: Tutors,
    argTypes: {
        needsAuth: {control: 'boolean'},
        isMobile: {control: 'boolean'},
        changeNeedsAuth: {action: 'changeNeedsAuth'},
    }
};

export default meta;
type Story = StoryObj<typeof Tutors>;

export const Primary: Story = {
    args: {
        changeNeedsAuth: (a: boolean) => {

        },
        needsAuth: false,
    }
};
