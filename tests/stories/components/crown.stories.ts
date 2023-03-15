import type {Meta, StoryObj} from '@storybook/preact';

import TopUsers from "components/topUsers"
import {Crown} from "components/topUsers";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof Crown> = {
    title: 'Components/Crown',
    component: Crown,
};

export default meta;
type Story = StoryObj<typeof Crown>;

// export const Primary: Story = {
//     args: {
//         isLoading: false,
//     }
// };
//
// export const Loading: Story = {
//     args: {
//         isLoading: true,
//     }
// };
//
// type Story1 = StoryObj<typeof Crown>;
export const Crown1: Story = {
    args: {
        place: 1,
    }
}

export const Crown2: Story = {
    args: {
        place: 2,
    }
}

export const Crown3: Story = {
    args: {
        place: 3,
    }
}

export const CrownDefault: Story = {
    args: {
        place: 4,
    }
}
