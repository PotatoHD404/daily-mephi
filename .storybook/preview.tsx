import 'styles/globals.css'
import type {Preview} from "@storybook/react";
import {SessionProvider} from "next-auth/react";
import React from "preact/compat";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {IsMobileProvider} from "lib/react/isMobileContext";
import {useState} from "react";
import {INITIAL_VIEWPORTS} from '@storybook/addon-viewport';

import {initialize, mswLoader} from 'msw-storybook-addon';

initialize({
    onUnhandledRequest: "bypass",
})

export const loaders: any[] = [mswLoader];

export const decorators: any[] = [
    (StoryFn: any, {args}: any) => {
        // console.log(args.session)
        const session: any = args.session === "Not logged in" ? null : {
            user: {
                name: "PotatoHD",
                email: null,
                image: null,
            },
            expires: null,
        };
        const queryClient = new QueryClient();
        const [isMobile, changeIsMobile] = useState<boolean>(false);
        return (
            <SessionProvider session={session} refetchOnWindowFocus={true}>
                { /* @ts-ignore */}
                <QueryClientProvider client={queryClient}>
                    { /* @ts-ignore */}
                    <IsMobileProvider value={isMobile}>
                        { /* @ts-ignore */}
                        {StoryFn()}
                    </IsMobileProvider>
                </QueryClientProvider>
            </SessionProvider>
        )
    },
];

const preview: Preview = {
    parameters: {
        backgrounds: {
            default: "light",
        },
        isMobile: {
            default: false,
            values: [false, true],
        },
        actions: {argTypesRegex: "^on[A-Z].*"},
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/,
            },
        },
        viewport: {
            viewports: INITIAL_VIEWPORTS,
        },
    },
    decorators,
    loaders
};

export default preview;
