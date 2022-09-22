import React from "react";
import SEO from "components/seo";

import dynamic from "next/dynamic";
const Filters = dynamic(() => import("components/filters"), {ssr: false});
const FilterButtons = dynamic(() => import("components/filterButtons"), {ssr: false});
import Tutor from "components/tutor";
import useIsMobile from "../../helpers/react/isMobileContext";

const marks = [
    {
        value: 0.5,
        label: (<div>0.5</div>),
    },
    {
        value: 5,
        label: (<div>5</div>),
    },
];
// <Button onClick={props.postForm}
//         className="rounded-full text-black
//                                             font-[Montserrat] font-bold text-center
//                                              w-full normal-case h-8">
//     Отправить
// </Button>
function Tutors() {
    const isMobile = useIsMobile();
    const [value, setValue] = React.useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    return (
        <>
            <SEO title='Преподаватели' thumbnail={`https://daily-mephi.ru/images/thumbnails/tutors.png`}/>

            <div className="flex flex-wrap w-full justify-center">
                <h1 className="text-2xl mb-2 font-semibold">Преподаватели</h1>
                {isMobile ? <FilterButtons/> : null}
                <div className="w-full h-[1px] bg-black bg-opacity-10"/>
                <div className="flex">
                    <div className="md:w-[75%] w-[100%]">
                        <Tutor/>
                        <Tutor/>
                    </div>
                    {
                    !isMobile ? <Filters/> : null
                    }
                </div>
            </div>
        </>);

}

export default Tutors;



