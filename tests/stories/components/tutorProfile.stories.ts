import type {Meta, StoryObj} from '@storybook/preact';

import TutorProfile from "components/tutorProfile"

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof TutorProfile> = {
    title: 'Tutor Profile',
    component: TutorProfile,
};

export default meta;
type Story = StoryObj<typeof TutorProfile>;

export const Primary: Story = {};
