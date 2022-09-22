import React from "react";
import SEO from "components/seo";


function Material() {
    const id = "123";
    return (
        <>
            <SEO title={'Материал'} thumbnail={`https://daily-mephi.ru/api/v1/thumbnails/materials/${id}.png`}/>
            <div className="flex-wrap w-full">
            </div>
        </>
    );

}

export default Material;
