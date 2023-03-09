import type {Meta, StoryObj} from '@storybook/preact';

import Tutor from "components/tutor"

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof Tutor> = {
    title: 'Tutor',
    component: Tutor,
};

export default meta;
type Story = StoryObj<typeof Tutor>;

export const Primary: Story = {};
