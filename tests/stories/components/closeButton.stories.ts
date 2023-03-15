import type {Meta, StoryObj} from '@storybook/preact';
import CloseButton from "components/closeButton";


// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof CloseButton> = {
    title: 'Components/Close button',
    component: CloseButton,
};

export default meta;
type Story = StoryObj<typeof CloseButton>;

export const Primary: Story = {};
