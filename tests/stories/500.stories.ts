import type { Meta, StoryObj } from '@storybook/preact';

import Page500 from "pages/500"

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof Page500> = {
    title: 'Page 500 page',
    component: Page500,
    tags: ['autodocs'],
    argTypes: {
        backgroundColor: {
            control: 'color',
        },
    },
};

export default meta;
type Story = StoryObj<typeof Page500>;
