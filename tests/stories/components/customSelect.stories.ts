import type {Meta, StoryObj} from '@storybook/preact';

import CustomSelect from "components/customSelect";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof CustomSelect> = {
    title: 'Custom select',
    component: CustomSelect,
};

export default meta;
type Story = StoryObj<typeof CustomSelect>;

export const Primary: Story = {};
