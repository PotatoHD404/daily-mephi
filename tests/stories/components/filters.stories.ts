import type {Meta, StoryObj} from '@storybook/preact';

import Filters from "components/filters";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof Filters> = {
    title: 'Components/Filters',
    component: Filters,
};

export default meta;
type Story = StoryObj<typeof Filters>;

export const Primary: Story = {};
