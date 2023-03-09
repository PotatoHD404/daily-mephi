import type {Meta, StoryObj} from '@storybook/preact';

import FilterButtons from "components/buyMeCoffee"

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof FilterButtons> = {
    title: 'Fliter buttons',
    component: FilterButtons,
};

export default meta;
type Story = StoryObj<typeof FilterButtons>;

export const Primary: Story = {};
