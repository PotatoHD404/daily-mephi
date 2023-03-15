import type {Meta, StoryObj} from '@storybook/preact';

import DislikeBtn from "components/dislikeBtn";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof DislikeBtn> = {
    title: 'Components/Dislike button',
    component: DislikeBtn,
};

export default meta;
type Story = StoryObj<typeof DislikeBtn>;
let pressed = false;
export const Primary: Story = {
    args: {
        count: 0,
        pressed: pressed,
        onClick: () => {
            pressed = !pressed;
        }
    }
};
