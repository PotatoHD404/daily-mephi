import type { Meta, StoryObj } from '@storybook/preact';

import Review from "pages/reviews/[id]"

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof Review> = {
    title: 'Review page',
    component: Review,
    tags: ['autodocs'],
    argTypes: {
        backgroundColor: {
            control: 'color',
        },
    },
};

export default meta;
type Story = StoryObj<typeof Review>;
