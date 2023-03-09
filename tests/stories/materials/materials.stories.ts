import type { Meta, StoryObj } from '@storybook/preact';

import Materials from "pages/materials/index"

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof Materials> = {
    title: 'Materials page',
    component: Materials,
    tags: ['autodocs'],
    argTypes: {
        backgroundColor: {
            control: 'color',
        },
    },
};

export default meta;
type Story = StoryObj<typeof Materials>;
