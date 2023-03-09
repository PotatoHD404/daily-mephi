import type { Meta, StoryObj } from '@storybook/preact';

import Quote from "pages/quotes/[id]"

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof Quote> = {
    title: 'Quote page',
    component: Quote,
    tags: ['autodocs'],
    argTypes: {
        backgroundColor: {
            control: 'color',
        },
    },
};

export default meta;
type Story = StoryObj<typeof Quote>;
