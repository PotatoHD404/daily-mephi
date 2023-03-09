import type { Meta, StoryObj } from '@storybook/preact';

import Search from "pages/search"

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof Search> = {
    title: 'Search page',
    component: Search,
    tags: ['autodocs'],
    argTypes: {
        backgroundColor: {
            control: 'color',
        },
    },
};

export default meta;
type Story = StoryObj<typeof Search>;
