import React from "react";
import Head from "next/head";


function SEO({description, title}: { description: string, title: string }) {

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
            <link
                href="/favicon-16x16.png"
                rel="icon"
                type="image/png"
                sizes="16x16"
            />
            <link
                href="/favicon-32x32.png"
                rel="icon"
                type="image/png"
                sizes="32x32"
            />
            {/*<link rel="apple-touch-icon" href="/apple-icon.png"/>*/}
            <meta name="theme-color" content="#317EFB"/>
            <title>{title + " | Daily MEPhi"}</title>
            <meta name="description" content={description}/>
            <meta property="og:description" content={description}/>
            <meta property="og:locale" content="ru"/>
            <meta property="og:title" content={title + " | Daily MEPhi"}/>
            <meta property="vk:image" content='/icons/icon-512x512.png'/>
            <meta property="og:type" content="website"/>
            <meta property="og:image" content='/icons/icon-512x512.png'/>
            <meta property="og:site_name" content="daily-mephi.ru"/>
        </Head>
    );
}

export default SEO;
