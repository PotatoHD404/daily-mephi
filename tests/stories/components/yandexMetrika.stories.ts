import type {Meta, StoryObj} from '@storybook/preact';

import MetricContainer from "components/yandexMetrika";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof MetricContainer> = {
    title: 'Metric container',
    component: MetricContainer,
};

export default meta;
type Story = StoryObj<typeof MetricContainer>;

export const Primary: Story = {};
