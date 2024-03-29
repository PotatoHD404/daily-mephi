import type {Meta, StoryObj} from '@storybook/react';

import Footer from "components/footer";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof Footer> = {
    title: 'Components/Footer',
    component: Footer,
};

export default meta;
type Story = StoryObj<typeof Footer>;

export const Primary: Story = {};
