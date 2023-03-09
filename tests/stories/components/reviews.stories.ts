import type {Meta, StoryObj} from '@storybook/preact';

import Reviews from "components/reviews";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof Reviews> = {
    title: 'Reviews',
    component: Reviews,
};

export default meta;
type Story = StoryObj<typeof Reviews>;

export const Primary: Story = {};
