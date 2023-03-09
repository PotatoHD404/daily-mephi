import type { Meta, StoryObj } from '@storybook/preact';

import Index from "pages/index"

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof Index> = {
    title: 'Index page',
    component: Index,
    tags: ['autodocs'],
    argTypes: {
        backgroundColor: {
            control: 'color',
        },
    },
};

export default meta;
type Story = StoryObj<typeof Index>;
