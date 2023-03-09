import type {Meta, StoryObj} from '@storybook/preact';

import RegisterDialog from "components/registerDialog";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof RegisterDialog> = {
    title: 'Register dialog',
    component: RegisterDialog,
};

export default meta;
type Story = StoryObj<typeof RegisterDialog>;

export const Primary: Story = {};
