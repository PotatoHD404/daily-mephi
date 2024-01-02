import type {Meta, StoryObj} from '@storybook/react';

import SEO from "components/seo";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof SEO> = {
    title: 'Components/SEO',
    component: SEO,
};

export default meta;
type Story = StoryObj<typeof SEO>;

export const Primary: Story = {};
