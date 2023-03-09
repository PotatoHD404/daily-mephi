import type { Meta, StoryObj } from '@storybook/preact';

import Tutor from "pages/tutors/[id]"

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof Tutor> = {
    title: 'Tutor page',
    component: Tutor,
    tags: ['autodocs'],
    argTypes: {
        backgroundColor: {
            control: 'color',
        },
    },
};

export default meta;
type Story = StoryObj<typeof Tutor>;
