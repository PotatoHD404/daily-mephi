import type {Meta, StoryObj} from '@storybook/react';

import FilterButtons from "components/filterButtons"

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof FilterButtons> = {
    title: 'Components/Filter buttons',
    component: FilterButtons,
};

export default meta;
type Story = StoryObj<typeof FilterButtons>;

export const Primary: Story = {};
