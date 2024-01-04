import type {Meta, StoryObj} from '@storybook/react';

import CustomAccordion from "components/customAccordion";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof CustomAccordion> = {
    title: 'Components/Custom accordion',
    component: CustomAccordion,
};

export default meta;
type Story = StoryObj<typeof CustomAccordion>;

export const Primary: Story = {
    args: {
        name: "Primary",
        defaultExpanded: true,
        children: <div>Content</div>
    }
};
