import type {Meta, StoryObj} from '@storybook/preact';

import withSession from "components/withSession";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof withSession> = {
    title: 'With session',
    component: withSession,
};

export default meta;
type Story = StoryObj<typeof withSession>;

export const Primary: Story = {};
