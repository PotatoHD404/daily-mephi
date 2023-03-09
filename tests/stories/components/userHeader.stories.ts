import type {Meta, StoryObj} from '@storybook/preact';

import UserHeaderComponent from "components/userHeader";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof UserHeaderComponent> = {
    title: 'User header',
    component: UserHeaderComponent,
};

export default meta;
type Story = StoryObj<typeof UserHeaderComponent>;

export const Primary: Story = {};
