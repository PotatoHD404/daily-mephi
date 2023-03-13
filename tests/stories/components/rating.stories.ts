import type {Meta, StoryObj} from '@storybook/preact';

import HoverRating from "components/rating";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof HoverRating> = {
    title: 'Components/Hover rating',
    component: HoverRating,
};

export default meta;
type Story = StoryObj<typeof HoverRating>;

export const Primary: Story = {};
