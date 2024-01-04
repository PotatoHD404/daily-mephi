import type {Meta, StoryObj} from '@storybook/react';

import LikeBtn from "components/likeBtn";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof LikeBtn> = {
    title: 'Components/Like button',
    component: LikeBtn,
};

export default meta;
type Story = StoryObj<typeof LikeBtn>;

export const Primary: Story = {};
