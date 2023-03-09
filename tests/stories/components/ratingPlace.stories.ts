import type {Meta, StoryObj} from '@storybook/preact';

import RatingPlace from "components/ratingPlace";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof RatingPlace> = {
    title: 'Rating place',
    component: RatingPlace,
};

export default meta;
type Story = StoryObj<typeof RatingPlace>;

export const Primary: Story = {};
