import React from "react";
import SEO from "components/seo";
import Material from "components/material";

import dynamic from "next/dynamic";
import useIsMobile from "../../lib/react/isMobileContext";

const Filters = dynamic(() => import("components/filters"), {ssr: false});
const FilterButtons = dynamic(() => import("components/filterButtons"), {ssr: false});

function Materials() {
    const [value, setValue] = React.useState(0);
    const isMobile = useIsMobile();
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    return (
        <>
            <SEO title='Материалы' thumbnail={`https://daily-mephi.ru/images/thumbnails/materials.png`}/>
            {isMobile == null ? null :
                <div className="flex flex-wrap w-full justify-center">
                    <h1 className="text-2xl mb-2 font-semibold">Материалы</h1>
                    {isMobile ? <FilterButtons/> : null}
                    <div className="w-full h-[1px] bg-black bg-opacity-10"/>
                    <div className="flex">
                        <div className="md:w-[75%] w-[100%]">
                            <Material/>
                            <Material/>
                        </div>
                        {!isMobile ? <Filters/> : null}

                    </div>
                </div>
            }
        </>);

}

export default Materials;



