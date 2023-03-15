import type {Meta, StoryObj} from '@storybook/preact';

import NewPost from "components/newPost";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof NewPost> = {
    title: 'Components/New post',
    component: NewPost,
};

export default meta;
type Story = StoryObj<typeof NewPost>;

export const Primary: Story = {};
