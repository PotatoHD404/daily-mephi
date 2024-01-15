import type {Meta, StoryObj} from '@storybook/react';

import PostDialog from "components/postDialog";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof PostDialog> = {
    title: 'Components/Post dialog',
    component: PostDialog,
};

export default meta;
type Story = StoryObj<typeof PostDialog>;

export const Primary: Story = {
    args: {
        opened: true,
        value: 0
    }
};

export const Secondary: Story = {
    args: {
        opened: true,
        value: 1
    }
};

export const Third: Story = {
    args: {
        opened: true,
        value: 2
    }
};
