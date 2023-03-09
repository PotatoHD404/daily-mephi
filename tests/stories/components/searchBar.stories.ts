import type {Meta, StoryObj} from '@storybook/preact';

import SearchBar from "components/searchBar";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof SearchBar> = {
    title: 'Search bar',
    component: SearchBar,
};

export default meta;
type Story = StoryObj<typeof SearchBar>;

export const Primary: Story = {};
