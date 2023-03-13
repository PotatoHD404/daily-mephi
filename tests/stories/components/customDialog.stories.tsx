import type {Meta, StoryObj} from '@storybook/preact';

import CustomDialog from "components/customDialog";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof CustomDialog> = {
    title: 'Components/Custom dialog',
    component: CustomDialog,
};

export default meta;
type Story = StoryObj<typeof CustomDialog>;

export const Primary: Story = {args: {open: true, children: <div>Test children</div>}};
