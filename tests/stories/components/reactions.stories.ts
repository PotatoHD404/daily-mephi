import type {Meta, StoryObj} from '@storybook/preact';

import Reactions from "components/reactions";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof Reactions> = {
    title: 'Components/Reactions',
    component: Reactions,
};

export default meta;
type Story = StoryObj<typeof Reactions>;

export const Primary: Story = {
    args: {
        isLoading: false,
        type: '',
        likes: 0,
        dislikes: 0,
        comments: 0,
    }
};

export const Loading: Story = {
    args: {
        isLoading: true,
    }
};
