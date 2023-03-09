import type { Meta, StoryObj } from '@storybook/preact';

import Material from "pages/materials/[id]"

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof Material> = {
    title: 'Material page',
    component: Material,
    tags: ['autodocs'],
    argTypes: {
        backgroundColor: {
            control: 'color',
        },
    },
};

export default meta;
type Story = StoryObj<typeof Material>;
