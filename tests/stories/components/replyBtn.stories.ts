import type {Meta, StoryObj} from '@storybook/preact';

import ReplyBtn from "components/replyBtn";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof ReplyBtn> = {
    title: 'Reply button',
    component: ReplyBtn,
};

export default meta;
type Story = StoryObj<typeof ReplyBtn>;

export const Primary: Story = {};
