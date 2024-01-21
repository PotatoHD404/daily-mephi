import React, {useState} from 'react'
import Image from "next/image";
import {ClientSafeProvider, getProviders, signIn} from "next-auth/react";
import RippledButton from "../components/rippledButton";
import {useRouter} from "next/router";
import {CircularProgress} from "@mui/material";

export interface OAuthProviderButtonStyles {
    logo: string
    logoDark?: string
    bg: string
    bgDark?: string
    text: string
    textDark?: string
}

export default function SignIn({providers}: {
    providers: Record<string, ClientSafeProvider & { style: OAuthProviderButtonStyles }>
}) {
    const router = useRouter();
    const [isLoading, changeIsLoading] = useState<string>('');
    // get error from query params
    const {error} = router.query

    // console.log('Custom Signin page was called.')
    const providerLogoPath = "https://authjs.dev/img/providers"


// const callbackUrl = "/api/auth/callback/credentials"
    return (
        <div className="w-1/2 flex-wrap">
            {/* if error == OAuthCreateAccount then write something*/}
            {error == 'OAuthCreateAccount' ? <div className="text-md text-center bg-red-400 font-bold rounded mb-4">Вы можете зарегестрироваться только используя аккаунт home.mephi, после чего вы сможете привязать к нему другой аккаунт</div> : null}
            {Object.values(providers).map((provider) => {
                let logo: string | undefined
                if (provider.type === "oauth") {

                    logo = provider.id !== 'home' ? providerLogoPath + provider.style.logo : '/api/auth/images/mephi.png'
                }
                return (
                    <div key={provider.id} className={`flex`}>
                        {provider.type === "oauth" ? (
                            <RippledButton
                                className={`flex items-center justify-center w-full px-4 my-1 py-2.5 text-base
                                     font-medium
                                      border rounded-md shadow-sm text-center`}
                                style={{backgroundColor: provider.style.bg, color: provider.style.text}}
                                onClick={async () => {
                                    changeIsLoading(provider.id);
                                    await signIn(provider.id, {callbackUrl: '/'})
                                }}
                            >
                                {logo && (
                                    <Image
                                        loading="lazy"
                                        height={24}
                                        width={24}
                                        id={`${provider.id}-provider-logo`}
                                        src={logo}
                                        alt={`${provider.id} logo`}
                                        className={"mr-auto"}
                                    />
                                )}
                                <span className="w-full">{isLoading == provider.id ?
                                    <CircularProgress color="inherit"
                                                      thickness={3}
                                                      size={30}
                                                      className="my-auto"/> : `Sign in with ${provider.name}`}</span>
                            </RippledButton>
                        ) : null}
                    </div>
                )
            })}
        </div>);
}


SignIn.getInitialProps = async () => {
    const providerStyles: Record<string, OAuthProviderButtonStyles> = {
        home: {logo: "images/mephi.png", bg: "#E8E9EB", text: "#000000"},
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