import 'styles/globals.css'
import {getSession, SessionProvider} from "next-auth/react"
import {NextComponentType} from "next";
import {Session} from "next-auth";
import {JSXInternal} from "preact/src/jsx";
import React, {ReactNode} from "react";
import Footer from "components/footer";
import Image from "next/future/image";
import Image1 from "next/image";
import Background from 'images/bg.svg'
import Background1 from 'images/bg.png'
import mobile_bg from 'images/mobile_bg.png'
import ellipse_bg from 'images/mobile_bg.svg'
import ellipse from 'images/ellipse.svg'
import styles from "styles/home.module.css";
import Navbar from "components/navbar";
import {useRouter} from "next/router";
import {createTheme, ThemeProvider} from "@mui/material";
// import IntrinsicAttributes = JSXInternal.IntrinsicAttributes;
import MetricContainer from "../components/yandexMetrika";


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

function BackgroundComp({home}: { home: boolean }) {
    return (
        <div>
            <div className={styles.bgWrap}>
                <div className="hidden md:flex"><Image1
                    src={Background}
                    alt="background gradient"
                    quality={100}
                    objectFit="cover"
                    layout="fill"
                /></div>
            </div>
            <div className={`-z-10 absolute overflow-clip w-full h-full ${home ? "md:" : ""}hidden`}>
                <div className="justify-center items-center flex-wrap w-[300vw]">
                    <div className="overflow-hidden h-[64vh] w-full xs:h-[85vh]">
                        <Image
                            src={Background1}
                            alt="background gradient"
                            quality={100}
                            className="w-[200vw] h-[100vh] opacity-80"
                        />
                    </div>

                    {/*<Image*/}
                    {/*    src={ellipse}*/}
                    {/*    alt="background gradient"*/}
                    {/*    quality={100}*/}
                    {/*    className="-mt-[32.5vh] scale-125 -ml-[25vw]"*/}
                    {/*/>*/}
                    {/*<div className="bg-white w-full h-20 -mt-2 absolute"></div>*/}

                </div>
            </div>
            <div className={styles.bgWrap}>
                <div className={`${home ? "" : "md:"}hidden`}><Image1
                    src={Background1}
                    alt="background gradient"
                    quality={100}
                    objectFit="cover"
                    layout="fill"
                /></div>
            </div>

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
