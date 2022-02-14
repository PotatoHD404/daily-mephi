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
import Background from '../images/bg.svg';
import Image from "next/image";
import template from "../images/template2.png";
import styles from "../styles/home.module.css";
import Navbar from "../components/navbar";

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
        <div className="font-[Montserrat] h-screen grid">
             <div className={styles.bgWrap}><Image
                src={template}
                alt="Picture of the author"
                quality={100}
                objectFit="cover"
            /></div>

            {/*<div className={styles.bgWrap}><Image*/}
            {/*    src={Background}*/}
            {/*    alt="Picture of the author"*/}
            {/*    quality={100}*/}
            {/*    objectFit="cover"*/}
            {/*    layout="fill"*/}
            {/*/></div>*/}

            <Navbar/>
            <Component {...pageProps} />
            <Footer/>
        </div>
    </SessionProvider>


}

export default MyApp