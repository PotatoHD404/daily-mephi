import React from "react";
import Head from "next/head";
import MetricContainer from "./yandexMetrika";


function SEO({title, card = "/images/twitter-large.png"}: { title?: string, card?: string }) {
    let title1: string;
    let title2: string;
    if (title) {
        title1 = title + " - Daily MEPhi";
        title2 = "Daily MEPhi - " + title;
    } else {
        title1 = "Daily MEPhi";
        title2 = "Студенческий портал Daily MEPhi";
    }
    return (
        <Head>
            <meta charSet="utf-8"/>
            <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
            <meta
                name="viewport"
                content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
            />
            <link rel="icon" href="/favicon.ico"/>
            <meta name="keywords" content="Keywords"/>
            <link rel="manifest" href="/manifest.json"/>
            {/*<link*/}
            {/*    href="/favicon-16x16.png"*/}
            {/*    rel="icon"*/}
            {/*    type="image/png"*/}
            {/*    sizes="16x16"*/}
            {/*/>*/}
            {/*<link*/}
            {/*    href="/favicon-32x32.png"*/}
            {/*    rel="icon"*/}
            {/*    type="image/png"*/}
            {/*    sizes="32x32"*/}
            {/*/>*/}
            {/*<link rel="apple-touch-icon" href="/apple-icon.png"/>*/}
            <meta name="theme-color" content="#317EFB"/>
            <title>{title1}</title>
            {/*<meta name="description" content={description}/>*/}
            {/*<meta property="og:description" content={description}/>*/}
            <meta property="og:locale" content="ru"/>
            <meta property="og:title" content={"Студенческий портал Daily MEPhi"}/>
            <meta property="og:title" content={title2}/>

            <meta property="vk:image" content={card}/>
            <meta property="og:type" content="object"/>
            <meta name="twitter:title" content="Daily MEPhi"/>
            <meta name="twitter:card" content="summary_large_image"/>
            <meta name="twitter:image:src" content={card}/>
            <meta property="og:image" content={card}/>
            <meta property="og:image:width" content='1200'/>
            <meta property="og:image:height" content='630'/>
            <meta property="og:site_name" content="daily-mephi.ru"/>
            <MetricContainer/>
        </Head>
    );
}

export default SEO;
