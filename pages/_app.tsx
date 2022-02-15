import '../styles/globals.css'
import {SessionProvider} from "next-auth/react"
import {NextComponentType} from "next";
import {Session} from "next-auth";
import {JSXInternal} from "preact/src/jsx";
import IntrinsicAttributes = JSXInternal.IntrinsicAttributes;
import React, {ReactNode} from "react";
import Footer from "../components/footer";
import Image from "next/image";
import template from "../images/template4.png";
import Background from '../images/bg.svg'
import styles from "../styles/home.module.css";
import Navbar from "../components/navbar";
import {useRouter} from "next/router";

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

    const router = useRouter();

    const home: boolean = router.pathname === '/';

    return <SessionProvider session={session}>
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
        <div className={"font-[Montserrat] " + (home ? "grid h-screen" : "w-[93.5vw] mx-auto")}>


            <Navbar/>
            <Component {...pageProps} />
            <Footer/>
        </div>
    </SessionProvider>


}

export default MyApp