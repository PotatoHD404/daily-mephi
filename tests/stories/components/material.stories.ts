import type {Meta, StoryObj} from '@storybook/preact';

import Material from "components/material";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof Material> = {
    title: 'Components/Material',
    component: Material,
};

export default meta;
type Story = StoryObj<typeof Material>;

export const Primary: Story = {};
