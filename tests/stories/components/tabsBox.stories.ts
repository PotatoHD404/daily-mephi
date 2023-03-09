import type {Meta, StoryObj} from '@storybook/preact';

import TabsBox from "components/tabsBox";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof TabsBox> = {
    title: 'Tabs box',
    component: TabsBox,
};

export default meta;
type Story = StoryObj<typeof TabsBox>;

export const Primary: Story = {};
