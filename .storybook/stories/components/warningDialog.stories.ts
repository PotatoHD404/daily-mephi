import type {Meta, StoryObj} from '@storybook/react';

import WarningDialog from "components/warningDialog";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof WarningDialog> = {
    title: 'Components/Warning dialog',
    component: WarningDialog,
};

export default meta;
type Story = StoryObj<typeof WarningDialog>;

export const Primary: Story = {
    args: {
        opened: true,
    }
};
