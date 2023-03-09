import type { Meta, StoryObj } from '@storybook/preact';

import Page404 from "pages/404"

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof Page404> = {
    title: 'Page 404 page',
    component: Page404,
    tags: ['autodocs'],
    argTypes: {
        backgroundColor: {
            control: 'color',
        },
    },
};

export default meta;
type Story = StoryObj<typeof Page404>;
