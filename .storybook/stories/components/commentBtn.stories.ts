import type {Meta, StoryObj} from '@storybook/react';

import CommentBtn from "components/commentBtn"

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof CommentBtn> = {
    title: 'Components/Comment button',
    component: CommentBtn,
};

export default meta;
type Story = StoryObj<typeof CommentBtn>;

export const Primary: Story = {
    args: {
        count: 0,
    }
};
