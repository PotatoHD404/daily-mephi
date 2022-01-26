import '../styles/globals.css'
import type {AppProps} from 'next/app'
import {SessionProvider} from "next-auth/react"
import {NextComponentType} from "next";
import {Session} from "next-auth";
import {JSXInternal} from "preact/src/jsx";
import IntrinsicAttributes = JSXInternal.IntrinsicAttributes;
import {ReactNode} from "react";
import {AppPropsType} from "next/dist/shared/lib/utils";


function MyApp({
                   Component,
                   pageProps: {session, ...pageProps}
               }: { Component: NextComponentType, pageProps: { session: Session, pageProps: any } }) {

    // @ts-ignore
    return <SessionProvider session={session}> <Component {...pageProps} /> </SessionProvider>


}

export default MyApp