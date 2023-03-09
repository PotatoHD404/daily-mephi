import type { Meta, StoryObj } from '@storybook/preact';

import Tutors from "pages/tutors/index"

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof Tutors> = {
    title: 'Tutors page',
    component: Tutors,
    tags: ['autodocs'],
    argTypes: {
        backgroundColor: {
            control: 'color',
        },
    },
};

export default meta;
type Story = StoryObj<typeof Tutors>;
