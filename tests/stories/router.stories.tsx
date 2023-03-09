import React from 'react';
import Index from 'pages/index';
import {Meta, StoryObj} from "@storybook/preact";

const meta: Meta<typeof Index> = {
    title: 'Index page',
    component: Index,
    tags: ['autodocs'],
    argTypes: {
        needsAuth: {control: 'boolean'},
        isMobile: {control: 'boolean'},
        changeNeedsAuth: {action: 'changeNeedsAuth'},
    }
};

export default meta;
type Story = StoryObj<typeof Index>;

export const Primary: Story = {
    args: {
        changeNeedsAuth: () => {

        },
        needsAuth: false,
        isMobile: false
    }
};

// export default {
//     component: Index,
//     title: 'Index page',
//
//     argTypes: {
//         needsAuth: {control: 'boolean'},
//         changeNeedsAuth: {action: 'changeNeedsAuth'},
//     }
// };
//
// export const Default = () => <Index changeNeedsAuth={() => {
// }}/>;
