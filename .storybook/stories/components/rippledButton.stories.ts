import type {Meta, StoryObj} from '@storybook/react';

import RippledButton from "components/rippledButton";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof RippledButton> = {
    title: 'Components/Rippled button',
    component: RippledButton,
};

export default meta;
type Story = StoryObj<typeof RippledButton>;

export const Primary: Story = {};
