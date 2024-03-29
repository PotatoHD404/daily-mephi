import React, {useState} from 'react'
import Image from "next/image";
import {signIn, useSession} from "next-auth/react";
import RippledButton from "../components/rippledButton";
import {useRouter} from "next/router";
import {CircularProgress} from "@mui/material";
import {Session} from "next-auth";
import {MyAppUser} from "../lib/auth/nextAuthOptions";
import {providerProps} from "../lib/react/providerProps";

export interface OAuthProviderButtonStyles {
    logo: string
    logoDark?: string
    bg: string
    bgDark?: string
    text: string
    textDark?: string
}

export default function SignIn({profile}: {
    profile?: boolean
}) {
    const router = useRouter();
    const [isLoading, changeIsLoading] = useState<string>('');
    const {data: session, status} = useSession() as any as {
        data: Session & { user: MyAppUser },
        status: "authenticated" | "loading" | "unauthenticated"
    }
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
        <div className={`${!profile ? 'max-w-96 whiteBox' : 'w-full'} flex-row flex-wrap gap-x-8 gap-y-4`}>
            {/* if error == OAuthCreateAccount then write something*/}
            {!profile ? (
                <div className="w-full mx-auto">
                    <h2 className={"text-center font-bold text-xl"}>Вход</h2>
                </div>) : null}
            {error == 'OAuthCreateAccount' ?
                <div className="text-md text-center bg-red-400 font-bold rounded mb-4">Вы можете зарегестрироваться
                    только используя аккаунт home.mephi, после чего вы сможете привязать к нему другой
                    аккаунт</div> : null}
            {providerProps.map((provider) => {
                let logo: string | undefined
                const loading = isLoading == provider.id || status === "loading"
                const isConnected = session?.user?.accounts.map(account => account.provider).includes(provider.id);
                if (provider.type === "oauth") {
                    logo = providerLogoPath;
                    if (isConnected)
                        logo += "/green";
                    logo += provider.style.logo;
                }

                return provider.type === "oauth" ? (
                    <div
                        className={`${profile ? 'md:w-56 max-w-96 md:mx-0' : ''} w-full mx-auto h-fit border-2 ${isConnected ? 'border-[#238F19]' : 'border-black'} rounded-xl`}>
                        <RippledButton
                            className={`items-center w-full px-4 py-2.5 text-base
                                     font-medium rounded-xl text-center`}
                            style={{
                                backgroundColor: "white",
                                color: isConnected ? "#238F19" : "black",
                            }}
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
                                                  className="my-auto"/> : isConnected ? `${provider.name}` : `${profile ? 'Привязать ' : ''}${provider.name}`}</span>
                        </RippledButton>
                    </div>) : null
            })}
        </div>);
}