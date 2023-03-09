import type {Meta, StoryObj} from '@storybook/preact';

import Reactions from "components/reactions";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof Reactions> = {
    title: 'Reactions',
    component: Reactions,
};

export default meta;
type Story = StoryObj<typeof Reactions>;

export const Primary: Story = {};
