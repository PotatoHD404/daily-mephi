import type {Meta, StoryObj} from '@storybook/react';

import UserHeaderComponent from "components/userHeader";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof UserHeaderComponent> = {
    title: 'Components/User header',
    component: UserHeaderComponent,
};

export default meta;
type Story = StoryObj<typeof UserHeaderComponent>;

export const Primary: Story = {};
