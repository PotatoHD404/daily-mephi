import type {Meta, StoryObj} from '@storybook/preact';

import Navbar from "components/navbar";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof Navbar> = {
    title: 'Navbar',
    component: Navbar,
};

export default meta;
type Story = StoryObj<typeof Navbar>;

export const Primary: Story = {};
