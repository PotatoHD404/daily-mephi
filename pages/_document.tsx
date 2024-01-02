'use client';

import {Head, Html, Main, NextScript} from 'next/document'
import MetricContainer from "../components/yandexMetrika";
import React from "react";

export default function Document() {


    // noinspection HtmlRequiredTitleElement
    return (
        <Html lang="ru">
            <Head/>
            <body>
            <Main/>
            <NextScript/>
            </body>
        </Html>
    )
}
