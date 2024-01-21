import React, {useState} from 'react'
import Image from "next/image";
import {signIn, useSession} from "next-auth/react";
import RippledButton from "../components/rippledButton";
import {useRouter} from "next/router";
import {CircularProgress} from "@mui/material";
import {Session} from "next-auth";
import {MyAppUser} from "../lib/auth/nextAuthOptions";
import {getProvidersProps, ProvidersProps} from "../lib/react/getProviders";

export interface OAuthProviderButtonStyles {
    logo: string
    logoDark?: string
    bg: string
    bgDark?: string
    text: string
    textDark?: string
}

export default function SignIn({providers, profile}: {
    providers: ProvidersProps,
    profile?: boolean
}) {
    const router = useRouter();
    const [isLoading, changeIsLoading] = useState<string>('');
    const {data: session, status} = useSession() as any as {
        data: Session & { user: MyAppUser },
        status: "authenticated" | "loading" | "unauthenticated"
    }
    console.log(session)
    // get error from query params
    const {error} = router.query

    if (!profile && session?.user?.id) {
        router.push(`/users/${session.user.id}`)
        return null
    }
    // console.log('Custom Signin page was called.')
    const providerLogoPath = "/images/auth"


// const callbackUrl = "/api/auth/callback/credentials"
    return (
        <div className={`${!profile ? 'w-1/2' : 'w-full'} flex-wrap`}>
            {/* if error == OAuthCreateAccount then write something*/}
            {error == 'OAuthCreateAccount' ?
                <div className="text-md text-center bg-red-400 font-bold rounded mb-4">Вы можете зарегестрироваться
                    только используя аккаунт home.mephi, после чего вы сможете привязать к нему другой
                    аккаунт</div> : null}
            {Object.values(providers).map((provider) => {
                let logo: string | undefined
                if (provider.type === "oauth") {

                    logo = providerLogoPath + provider.style.logo;
                }
                const loading = isLoading == provider.id || status === "loading"
                const isConnected = session?.user?.accounts.map(account => account.provider).includes(provider.id);
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
                                    await signIn(provider.id, {callbackUrl: session?.user?.id ? `/users/${session.user.id}` : '/'})
                                }}
                                disabled={loading || isConnected}
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
                                <span className="w-full">{isLoading == provider.id || status === "loading" ?
                                    <CircularProgress color="inherit"
                                                      thickness={3}
                                                      size={30}
                                                      className="my-auto"/> : isConnected ? `${provider.name} привязан` : `Войти через ${provider.name}`}</span>
                            </RippledButton>
                        ) : null}
                    </div>
                )
            })}
        </div>);
}


SignIn.getInitialProps = getProvidersProps