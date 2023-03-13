import type {Meta, StoryObj} from '@storybook/preact';

import LoadingBlock from "components/loadingBlock";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof LoadingBlock> = {
    title: 'Components/Loading block',
    component: LoadingBlock,
};

export default meta;
type Story = StoryObj<typeof LoadingBlock>;

export const Primary: Story = {};
