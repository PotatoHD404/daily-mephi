import type {Meta, StoryObj} from '@storybook/preact';

import WarningDialog from "components/warningDialog";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof WarningDialog> = {
    title: 'Warning dialog',
    component: WarningDialog,
};

export default meta;
type Story = StoryObj<typeof WarningDialog>;

export const Primary: Story = {};
