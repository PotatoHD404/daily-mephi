import React from "react";
import SEO from "components/seo";
import Material from "components/material";

import dynamic from "next/dynamic";
import useIsMobile from "lib/react/isMobileContext";
import {UserType} from "../../components/userHeader";

const Filters = dynamic(() => import("components/filters"), {ssr: true});
const FilterButtons = dynamic(() => import("components/filterButtons"), {ssr: true});

function Materials() {
    const isMobile = useIsMobile();
    const user: UserType = {
        id: "1",
        nickname: "Трифоненков В.П.",
        image: {
            url: "https://daily-mephi.ru/images/dead_cat.svg"
        },
        // legacyNickname: "User1"
    }
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
                            <Material user={user}/>
                            <Material user={user}/>
                        </div>
                        {!isMobile ? <Filters/> : null}

                    </div>
                </div>
            }
        </>);

}

export default Materials;



