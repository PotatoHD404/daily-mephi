import React from 'react';
import Material from 'pages/materials/[id]';
import {Meta, StoryObj} from "@storybook/preact";

const meta: Meta<typeof Material> = {
    title: 'Pages/Material page',
    component: Material,
    argTypes: {
        needsAuth: {control: 'boolean'},
        isMobile: {control: 'boolean'},
        changeNeedsAuth: {action: 'changeNeedsAuth'},
    }
};

export default meta;
type Story = StoryObj<typeof Material>;

export const Primary: Story = {
    args: {
        changeNeedsAuth: (a: boolean) => {

        },
        needsAuth: false,
    }
};
