import type {Meta, StoryObj} from '@storybook/preact';

import SearchFilter from "components/searchFilter";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof SearchFilter> = {
    title: 'Search filter',
    component: SearchFilter,
};

export default meta;
type Story = StoryObj<typeof SearchFilter>;

export const Primary: Story = {};
