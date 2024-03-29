import type {Meta, StoryObj} from '@storybook/react';

import Comment from "components/comment";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof Comment> = {
    title: 'Components/Comment',
    component: Comment,
};

export default meta;
type Story = StoryObj<typeof Comment>;

export const Primary: Story = {};
