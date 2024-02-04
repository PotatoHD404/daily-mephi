import 'styles/globals.css'
import {SessionProvider} from "next-auth/react"
import {NextComponentType} from "next";
import {Session} from "next-auth";
import React, {ReactNode, useState} from "react";
import Footer from "components/footer";
import Image from "next/image";
import Image1 from "next/image";
import Background1 from 'images/bg.webp'
import styles from "styles/home.module.css";
import Navbar from "components/navbar";
import {useRouter} from "next/router";
import {CircularProgress, createTheme, ThemeProvider} from "@mui/material";
import {trpc} from 'server/utils/trpc';

import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import useMediaQuery from "lib/react/useMediaQuery";
import {IsMobileProvider} from "lib/react/isMobileContext";
import {GoogleReCaptchaProvider} from "react-google-recaptcha-v3";
import MetricContainer from "components/yandexMetrika";
import {env} from "../lib/env";

// import NProgress from 'nprogress';

const queryClient = new QueryClient()


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


function BackgroundComp(props: { home: boolean, isMobile: boolean }) {

    return (
        <div>
            {
                props.home && props.isMobile ?
                    <div className={"-z-10 absolute overflow-clip w-full h-[100vh]"}>
                        <div className="justify-center items-center flex-wrap w-[300vw]">
                            <div className="w-full">
                                <Image
                                    src={Background1}
                                    alt="background gradient"
                                    quality={100}
                                    className="w-[200vw] h-[100vh] opacity-80"
                                    priority
                                />
                            </div>
                        </div>
                    </div> : null
            }
            {
                !props.home || !props.isMobile ? <div className={styles.bgWrap}>
                    <div><Image1
                        src={Background1}
                        alt="background gradient"
                        quality={100}
                        objectFit="cover"
                        layout="fill"
                        priority
                    /></div>
                </div> : null
            }
        </div>);
}

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
    const isMobile = useMediaQuery(768);
    const [needsAuth, changeNeedsAuth] = useState<boolean>(false);
    const home: boolean = router.pathname === '/';
    const home1: boolean = router.pathname === '/' || router.pathname === '/404' || router.pathname === '/500';

    pageProps = {...pageProps, isMobile, changeNeedsAuth};

    const [loading, setLoading] = React.useState(false);
    // React.useEffect(() => {
    //     const start = () => {
    //         // console.log("start");
    //         setLoading(true);
    //     };
    //     const end = () => {
    //         // console.log("findished");
    //         setLoading(false);
    //     };
    //     Router.events.on("routeChangeStart", start);
    //     Router.events.on("routeChangeComplete", end);
    //     Router.events.on("routeChangeError", end);
    //     return () => {
    //         Router.events.off("routeChangeStart", start);
    //         Router.events.off("routeChangeComplete", end);
    //         Router.events.off("routeChangeError", end);
    //     };
    // }, []);
    const isLoading = loading && router.isReady;
    // useEffect(() => {
    //     router.events.on('routeChangeStart', () =>  NProgress.start());

    //     router.events.on('routeChangeComplete', () =>  NProgress.done());
    //     router.events.on('routeChangeError', () =>  NProgress.done());
    //   }, []);
    return (
        <>
            <GoogleReCaptchaProvider reCaptchaKey={env.NEXT_PUBLIC_RECAPTCHA_PUBLIC || ""}
                                     scriptProps={{
                                         async: false,
                                         defer: false,
                                         appendTo: "head",
                                         nonce: undefined,
                                     }}
                                     language="ru">
                <IsMobileProvider value={isMobile}>
                    <QueryClientProvider client={queryClient}>
                        <SessionProvider session={session}>
                            <ThemeProvider theme={theme}>
                                {isMobile == null ? null : <BackgroundComp {...{home, isMobile}}/>}
                                <div className={"font-[Montserrat] relative min-h-screen pb-24 z-10"
                                    + (home ? "" : "max-w-[85rem] mx-auto")}>
                                    {isMobile == null ? null : <Navbar needsAuth={needsAuth}/>}
                                    {
                                        isLoading ? <div
                                            className="fixed top-0 left-0 w-full h-full z-50 overflow-hidden bg-white opacity-75 flex flex-col items-center justify-center">
                                            <CircularProgress color="inherit"
                                                              thickness={3}
                                                              size={30}
                                                              className="mb-2"/>
                                            <h2 className="text-center text-black text-xl font-semibold">Загрузка...</h2>
                                            <p className="w-1/3 text-center text-gray-500">Это может занять некоторое
                                                время</p>
                                        </div> : <>
                                            {home1 ?
                                                <div className={"md:px-8 mx-auto"}>
                                                    <Component {...pageProps}/>
                                                </div>
                                                :
                                                <div
                                                    className="rounded-2xl justify-center w-full flex pt-6 pb-10 md:px-8 px-2 my-12
                                                    bg-white bg-opacity-[36%] max-w-[1280px] mx-auto">
                                                    <Component {...pageProps} />
                                                </div>}
                                            {isMobile == null ? null : <Footer/>}
                                        </>
                                    }
                                </div>
                            </ThemeProvider>
                        </SessionProvider>
                    </QueryClientProvider>
                </IsMobileProvider>
            </GoogleReCaptchaProvider>
            <MetricContainer/>
        </>
    )

}


export default trpc.withTRPC(MyApp)
