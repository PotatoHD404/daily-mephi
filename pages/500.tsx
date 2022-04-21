import SEO from "components/seo";
import React from "react";

export default function Custom500() {

    return (
        <>
            <SEO title={'Ошибка на стороне сервера'}/>
            <h1>500 - Server-side error occurred</h1>
        </>
    );
}
// TODO