import type {StorybookConfig} from "@storybook/nextjs";

const config: StorybookConfig = {
    stories: ["../tests/stories/**/*.mdx", "../tests/stories/**/*.stories.@(js|jsx|ts|tsx)"],
    addons: [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@storybook/addon-interactions",
        '@storybook/addon-a11y',
        '@storybook/addon-interactions',
    ],
    framework: {
        name: "@storybook/nextjs",
        options: {},
    },
    docs: {
        autodocs: "tag",
    },
    staticDirs: ['../public'],
};
export default config;
