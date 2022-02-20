import '../styles/globals.css'
import {SessionProvider} from "next-auth/react"
import {NextComponentType} from "next";
import {Session} from "next-auth";
import {JSXInternal} from "preact/src/jsx";
import IntrinsicAttributes = JSXInternal.IntrinsicAttributes;
import React, {ReactNode} from "react";
import Footer from "../components/footer";
import Image from "next/image";
import template from "../images/template9.png";
import Background from '../images/bg.svg'
import styles from "../styles/home.module.css";
import Navbar from "../components/navbar";
import {useRouter} from "next/router";
import {orange} from "@mui/material/colors";
import {createTheme, ThemeProvider} from "@mui/material";


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
            {/*        objectFit="cover"*/}
            {/*    />*/}
            {/*</div>*/}

            <div className={styles.bgWrap}>
                <Image
                    src={Background}
                    alt="Picture of the author"
                    quality={100}
                    objectFit="cover"
                    layout="fill"
                />
            </div>
            <div className={"font-[Montserrat] " + (home ? "grid h-screen" : "w-[70%] mx-auto relative min-h-screen pb-24")}>


                <Navbar/>
                {home ?
                    <Component {...pageProps} /> :
                    <div className="rounded-2xl flex py-6 px-8 my-12 bg-white bg-opacity-[36%]">
                        <Component {...pageProps} />
                    </div>}
                <Footer/>
            </div>
        </ThemeProvider>
    </SessionProvider>


}

export default MyApp