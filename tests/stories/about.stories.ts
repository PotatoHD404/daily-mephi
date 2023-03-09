import type { Meta, StoryObj } from '@storybook/preact';

import About from "pages/about"

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof About> = {
    title: 'About page',
    component: About,
    tags: ['autodocs'],
    argTypes: {
        backgroundColor: {
            control: 'color',
        },
    },
};

export default meta;
type Story = StoryObj<typeof About>;
