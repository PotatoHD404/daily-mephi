import type {Meta, StoryObj} from '@storybook/react';

import Minicat from "components/minicat";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof Minicat> = {
    title: 'Components/Minicat',
    component: Minicat,
};

export default meta;
type Story = StoryObj<typeof Minicat>;

export const Primary: Story = {};
