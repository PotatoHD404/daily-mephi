import type {StorybookConfig} from "@storybook/nextjs";

const config: StorybookConfig = {
    stories: ["stories/**/*.mdx", "stories/**/*.stories.@(js|jsx|ts|tsx)"],
    addons: [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@storybook/addon-interactions",
        '@storybook/addon-a11y',
        '@storybook/addon-interactions',
    ],
    framework: {
        name: "@storybook/nextjs",
        options: { builder: { useSWC: true } }
    },
    docs: {
        autodocs: "tag",
    },
    build: {
        test: {
            disabledAddons: [
                '@storybook/addon-docs',
                '@storybook/addon-essentials/docs',
            ],
        },
    },
    staticDirs: [],
};
export default config;
