import type {Meta, StoryObj} from '@storybook/preact';

import TopUsers from "components/topUsers"

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof TopUsers> = {
    title: 'Components/Top Users',
    component: TopUsers,
};

export default meta;
type Story = StoryObj<typeof TopUsers>;

export const Primary: Story = {
    args: {
        isLoading: false,
    }
};

export const Loading: Story = {
    args: {
        isLoading: true,
    }
};
