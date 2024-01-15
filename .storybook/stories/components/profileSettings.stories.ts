import type {Meta, StoryObj} from '@storybook/react';

import BuyMeACoffeeWidget from "components/buyMeCoffee"
import ProfileSettings from "components/profileSettings";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof ProfileSettings> = {
    title: 'Components/Profile settings',
    component: ProfileSettings,
};

export default meta;
type Story = StoryObj<typeof ProfileSettings>;

export const Primary: Story = {};
