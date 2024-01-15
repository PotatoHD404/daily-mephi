import type {Meta, StoryObj} from '@storybook/react';

import RatingPlace from "components/ratingPlace";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof RatingPlace> = {
    title: 'Components/Rating place',
    component: RatingPlace,
};

export default meta;
type Story = StoryObj<typeof RatingPlace>;

export const Main: Story = {
    args: {
        place: 0,
        isLoading: false,
    }
};

export const Loading: Story = {
    args: {
        isLoading: true,
    }
};
