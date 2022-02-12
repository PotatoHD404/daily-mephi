import '../styles/globals.css'
import type {AppProps} from 'next/app'
import {SessionProvider} from "next-auth/react"
import {NextComponentType} from "next";
import {useSession} from "next-auth/react"
import {Session} from "next-auth";
import {JSXInternal} from "preact/src/jsx";
import IntrinsicAttributes = JSXInternal.IntrinsicAttributes;
import React, {ReactNode} from "react";
import {AppPropsType} from "next/dist/shared/lib/utils";
import Footer from "../components/footer";
import SEO from "../components/seo";
// import Header from "../components/header";
import Image from "next/image";
import template from "../images/template.jpg";
import styles from "../styles/home.module.css";

function MyApp(
    {
        Component,
        pageProps: {session, ...pageProps}
    }: {
        Component: NextComponentType,
        pageProps: IntrinsicAttributes &
            {
                children?: ReactNode,
                session: Session
            }
    }) {

    return <SessionProvider session={session}>
        <div>
            {/*    <Header/>*/}
            <Component {...pageProps} />
            {/*<Footer/>*/}
        </div>
    </SessionProvider>


}

export default MyApp