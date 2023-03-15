import type {Meta, StoryObj} from '@storybook/preact';
import {DefaultNavbar, HomeNavbar} from "components/navbar";


// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof DefaultNavbar> = {
    title: 'Components/Navbar',
    component: DefaultNavbar,
};

export default meta;
type Story = StoryObj<typeof DefaultNavbar>;

export const Default: Story = {};


type Story1 = StoryObj<typeof HomeNavbar>;

export const Home: Story1 = {};
