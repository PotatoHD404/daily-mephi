import React from "react";
import SEO from "components/seo";
import Image from "next/image";
import StarIcon from 'images/star.svg'

import TutorImage from "images/tutor.png";
import ReviewsIco from 'images/reviews.svg'
import QuotesIco from 'images/quotes.svg'
import MaterialsIco from 'images/materials.svg'
import Button from "@mui/material/Button";
import Link from "next/link";
import {FilterButtons, Filters} from "components/filters";
import Tutor from "components/tutor";



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
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    return (
        <>
            <SEO title='Преподаватели'/>

            <div className="flex flex-wrap w-full justify-center">
                <h1 className="text-2xl mb-2 font-semibold">Преподаватели</h1>
                <FilterButtons/>
                <div className="w-full h-[1px] bg-black bg-opacity-10"/>
                <div className="flex">
                    <div className="md:w-[75%] w-[100%]">
                        <Tutor/>
                        <Tutor/>
                    </div>
                    <Filters/>
                </div>
            </div>
        </>);

}

export default Tutors;



