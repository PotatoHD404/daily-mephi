import type {Meta, StoryObj} from '@storybook/preact';

import PostDialog from "components/postDialog";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof PostDialog> = {
    title: 'Post dialog',
    component: PostDialog,
};

export default meta;
type Story = StoryObj<typeof PostDialog>;

export const Primary: Story = {};
