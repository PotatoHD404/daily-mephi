import '../styles/globals.css'
import {SessionProvider} from "next-auth/react";
import {forceReRender} from "@storybook/react";

export const decorators = [
    (Story, {args}) => {
        // console.log(args.session)
        const session = args.session === "Not logged in" ? null : {
            user: {
                name: "PotatoHD",
                email: null,
                image: null,
            },
            expires: null,
        };
        return (
            <SessionProvider session={session} refetchOnWindowFocus={true}>
                <Story/>
            </SessionProvider>
        )
    },
];

export const argTypes = {
    session: {
        control: 'select',
        options: [
            "Not logged in",
            "Logged in",
        ]
    }
};

// The default value of the theme arg to all stories
export const args = {session: "Not logged in"};

export const parameters = {
    actions: {argTypesRegex: "^on[A-Z].*"},
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
    },
    nextRouter: {
        query: {
            foo: 'this-is-a-global-override'
        }
    }
}
