import {OAuthProviderButtonStyles} from "../../pages/signin";
import {ClientSafeProvider, getProviders} from "next-auth/react";
export type ProvidersProps = Record<string, ClientSafeProvider & { style: OAuthProviderButtonStyles }>

export const getProvidersProps = async () => {
    const providerStyles: Record<string, OAuthProviderButtonStyles> = {
        home: {logo: "/mephi.png", bg: "#E8E9EB", text: "#000000"},
        yandex: {logo: "/yandex.svg", bg: "#FFCC00", text: "#000000",},
        vk: {logo: "/vk.svg", bg: "#07F", text: "#FFFFFF"},
        google: {logo: "/google.svg", bg: "#FFFFFF", text: "#000000"},
        github: {logo: "/github.svg", bg: "#24292F", text: "#FFFFFF"},
    }
    const providers = await getProviders().then(provider => {
        if (provider == null) return {}
        return Object.entries(provider).map(([key, provider]) => {
            if (providerStyles[key]) {
                return {
                    ...provider,
                    style: providerStyles[key]
                }
            }
        })
    }) as Record<string, ClientSafeProvider & { style: OAuthProviderButtonStyles }>;
    return {
        providers
    }
}