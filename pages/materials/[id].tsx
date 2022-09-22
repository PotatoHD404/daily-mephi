import React from "react";
import SEO from "components/seo";
import useIsMobile from "../../helpers/react/isMobileContext";


function Material() {
    const id = "123";
    const isMobile = useIsMobile();
    return (
        <>
            <SEO title={'Материал'} thumbnail={`https://daily-mephi.ru/api/v1/thumbnails/materials/${id}.png`}/>
            {isMobile == null ? null :
                <div className="flex-wrap w-full">
                </div>
            }
        </>
    );

}

export default Material;
