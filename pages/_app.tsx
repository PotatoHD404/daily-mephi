import "reflect-metadata"
import 'styles/globals.css'
import {SessionProvider} from "next-auth/react"
import {NextComponentType} from "next";
import {Session} from "next-auth";
import {JSXInternal} from "preact/src/jsx";
import React, {ReactNode} from "react";
import Footer from "components/footer";
import Image from "next/image";
import Background from 'images/bg.svg'
import styles from "styles/home.module.css";
import Navbar from "components/navbar";
import {useRouter} from "next/router";
import {createTheme, ThemeProvider} from "@mui/material";
import IntrinsicAttributes = JSXInternal.IntrinsicAttributes;
import {MetricContainer} from "../components/yandexMetrika";


declare module '@mui/material/styles' {
    interface Theme {
        status: {
            danger: string;
        };
    }

    // allow configuration using `createTheme`
    interface ThemeOptions {
        status?: {
            danger?: string;
        };
    }
}

const theme = createTheme({
    palette: {
        primary: {
            main: '#ffffff',
        },
        // secondary: {
        //     main: '#ffffff',
        // },
        // background: {
        //     default: '#000000',
        // },
        // text: {
        //     primary: 'rgba(22,21,21,0.87)',
        // },
    }
});


// export const themeOptions: ThemeOptions = {
//     palette: {
//         type: 'light',
//         primary: {
//             main: 'rgba(63,81,181,0)',
//         },
//         secondary: {
//             main: '#ffffff',
//         },
//         background: {
//             default: '#000000',
//         },
//         text: {
//             primary: 'rgba(22,21,21,0.87)',
//         },
//     },
// };

function BackgroundComp() {
    return <div className={styles.bgWrap}>
        <Image
            src={Background}
            alt="background gradient"
            quality={100}
            objectFit="cover"
            layout="fill"
        />
    </div>;
}

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
        <ThemeProvider theme={theme}>
            {/*<div className={styles.bgWrap}>*/}
            {/*    <Image*/}
            {/*        src={template}*/}
            {/*        alt="Picture of the author"*/}
            {/*        quality={100}*/}
            {/*        objectFit="covers"*/}
            {/*    />*/}
            {/*</div>*/}
            <BackgroundComp/>
            {/*w-[125rem]*/}
            <div className={"font-[Montserrat] relative min-h-screen pb-24 "
                + (home ? "" : "max-w-[85rem] mx-auto")}>


                <Navbar/>
                {home ?
                    // @ts-ignore

                    <Component {...pageProps} /> :
                    <div className="rounded-2xl flex pt-6 pb-10 px-8 my-12 bg-white bg-opacity-[36%]">
                        {/* @ts-ignore */}
                        <Component {...pageProps} />
                    </div>}
                <Footer/>
            </div>
        </ThemeProvider>
    </SessionProvider>


}

export default MyApp
