import type {Meta, StoryObj} from '@storybook/preact';

import SliderFilter from "components/sliderFilter";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof SliderFilter> = {
    title: 'Components/Slider filter',
    component: SliderFilter,
};

export default meta;
type Story = StoryObj<typeof SliderFilter>;

export const Primary: Story = {
    args: {
        name: 'name',
        min: 0,
        max: 5,
    }
};
