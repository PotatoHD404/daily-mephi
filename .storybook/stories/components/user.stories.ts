import type {Meta, StoryObj} from '@storybook/react';

import User from "components/user"

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof User> = {
    title: 'Components/User',
    component: User,
};

export default meta;
type Story = StoryObj<typeof User>;

export const Primary: Story = {};
