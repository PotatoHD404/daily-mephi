import React from "react";
import SEO from "../../components/seo";
import Image from "next/image";
import StarIcon from 'images/star.svg'

import TutorImage from "../../images/tutor.png";
import ReviewsIco from 'images/reviews.svg'
import QuotesIco from 'images/quotes.svg'
import MaterialsIco from 'images/materials.svg'
import FiltersIco from 'images/filters.svg'
import Button from "@mui/material/Button";
import Link from "next/link";
import DownloadIco from "../../images/download.svg";
import LikeBtn from "../../components/likeBtn";
import DislikeBtn from "../../components/dislikeBtn";
import CommentBtn from "../../components/commentBtn";
import UserHeaderComponent from "../../components/userHeader";
import Reactions from "../../components/reactions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "../../images/close_icon.svg";
import Material from "../../components/material";

function Filters() {
    return <div className="w-[15rem] hidden md:block ml-auto mt-4">


        <div
            className="text-[1.25rem] ml-auto w-[99.5%] whiteBox flex-wrap space-y-2 text-center
                    text-[#5B5959]">
            <div className="w-full">ssas</div>
            <div className="w-full">ssas</div>
            <div className="w-full">ssas</div>
            <div className="w-full">ssas</div>
            <div className="w-full">ssas</div>
            <div className="w-full">ssas</div>
            <div className="w-full">ssas</div>
            <div className="w-full">ssas</div>
            <div className="w-full">ssas</div>
            <div className="w-full">ssas</div>
            <div className="w-full">ssas</div>
            <div className="w-full">ssas</div>
            <div className="w-full">ssas</div>
            <div className="w-full">ssas</div>
            <div className="w-full">ssas</div>
            <div className="w-full">ssas</div>
        </div>
    </div>;
}

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


function Materials() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    return (
        <>
            <SEO title='Материалы'/>

            <div className="flex flex-wrap w-full justify-center">
                <h1 className="text-2xl mb-2">Материалы</h1>
                <div className="md:hidden w-full mb-1 ml-2">
                    <Button className="rounded-full text-black font-[Montserrat] font-bold text-center
                                              w-fit normal-case h-8">
                        <div className="flex w-5 mb-[1px] mr-2">
                            <Image
                                src={FiltersIco}
                                alt="Filters ico"
                                className="my-auto"
                            />
                        </div>
                        <div>Фильтры</div>
                    </Button>
                </div>
                <div className="w-full h-[1px] bg-black bg-opacity-10"/>
                <div className="flex">
                    <div className="md:w-[75%] w-[100%]">
                        <Material/>
                        <Material/>
                    </div>
                    <Filters/>
                </div>
            </div>
        </>);

}

export default Materials;



