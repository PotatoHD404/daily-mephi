import 'styles/globals.css'
import {SessionProvider} from "next-auth/react"
import {NextComponentType} from "next";
import {Session} from "next-auth";
import React, {ReactNode} from "react";
import Footer from "components/footer";
import Image from "next/future/image";
import Image1 from "next/image";
import Background from 'images/bg.svg'
import Background1 from 'images/bg.webp'
import styles from "styles/home.module.css";
import Navbar from "components/navbar";
import {useRouter} from "next/router";
import {createTheme, ThemeProvider} from "@mui/material";
import {useMediaQuery} from "helpers/utils";


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



function BackgroundComp({home}: { home: boolean }) {
    const isMobile = useMediaQuery(768);
    return (
        <div>
            {/*{*/}
            {/*    !isMobile ?*/}
            {/*        <div className={styles.bgWrap}>*/}
            {/*            <div><Image1*/}
            {/*                src={Background}*/}
            {/*                alt="background gradient"*/}
            {/*                quality={100}*/}
            {/*                objectFit="cover"*/}
            {/*                layout="fill"*/}
            {/*            /></div>*/}
            {/*        </div> : null*/}
            {/*}*/}
            {
                home && isMobile ?
                    <div className={"-z-10 absolute overflow-clip w-full h-[100vh]"}>
                        <div className="justify-center items-center flex-wrap w-[300vw]">
                            <div className="w-full">
                                <Image
                                    src={Background1}
                                    alt="background gradient"
                                    quality={100}
                                    className="w-[200vw] h-[100vh] opacity-80"
                                />
                            </div>
                        </div>
                    </div> : null
            }
            {
                !home || !isMobile ? <div className={styles.bgWrap}>
                    <div><Image1
                        src={Background1}
                        alt="background gradient"
                        quality={100}
                        objectFit="cover"
                        layout="fill"
                    /></div>
                </div> : null
            }
        </div>);
}

const css = {width: '100px', backgroundRepeat: "no-repeat"}

function MyApp(
    {
        Component,
        pageProps: {session, ...pageProps}
    }: {
        Component: NextComponentType,
        pageProps: any &
            {
                children?: ReactNode,
                session: Session
            }
    }) {

    const router = useRouter();

    const home: boolean = router.pathname === '/';
    const home1: boolean = router.pathname === '/' || router.pathname === '/404' || router.pathname === '/500';

    return <SessionProvider session={session}>
        <ThemeProvider theme={theme}>

            <BackgroundComp {...{home}}/>

            <div className={"font-[Montserrat] relative min-h-screen pb-24 z-10"
                + (home ? "" : "max-w-[85rem] mx-auto")}>


                <Navbar/>
                {home1 ?
                    <div className={"md:px-8 mx-auto"}>
                        <Component {...pageProps} />
                    </div>
                    :
                    <div
                        className="rounded-2xl justify-center w-full flex pt-6 pb-10 md:px-8 px-2 my-12
                         bg-white bg-opacity-[36%] max-w-[1280px] mx-auto">
                        <Component {...pageProps} />
                    </div>}
                <Footer/>
            </div>
        </ThemeProvider>
    </SessionProvider>

}

export default MyApp
