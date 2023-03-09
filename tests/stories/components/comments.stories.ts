import type {Meta, StoryObj} from '@storybook/preact';

import Comments from "components/comments";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof Comments> = {
    title: 'Comments',
    component: Comments,
};

export default meta;
type Story = StoryObj<typeof Comments>;

export const Primary: Story = {};
