import type {Meta, StoryObj} from '@storybook/preact';

import BuyMeACoffeeWidget from "components/buyMeCoffee"

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof BuyMeACoffeeWidget> = {
    title: 'Buy me a coffee widget',
    component: BuyMeACoffeeWidget,
};

export default meta;
type Story = StoryObj<typeof BuyMeACoffeeWidget>;

export const Primary: Story = {};
