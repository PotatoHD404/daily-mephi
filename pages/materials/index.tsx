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
import {LikeComponent} from "../../components/like";
import {DislikeComponent} from "../../components/dislike";
import {CommentComponent} from "../../components/commentComponent";
import UserHeaderComponent from "../../components/UserHeader";

function Filters() {
    return <div className="w-[15rem] hidden md:block ml-auto mt-4">


        <div
            className="rounded-2xl pt-6 pb-4 px-3.5 text-[1.25rem] ml-auto w-[99.5%] bg-white bg-opacity-90 flex-wrap space-y-2 text-center
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

function Material() {
    return <div className="rounded-2xl p-5 text-xl w-full bg-white bg-opacity-[90%] mt-4">
        <UserHeaderComponent name={"User1"}
                             date={"15 февраля 2022"}/>
        <h1 className="font-bold text-[1.1rem] leading-6 mt-3">Название</h1>
        <div className="relative flex text-[1.0rem] leading-5">

            <div className="">Lorem ipsum dolor sit amet, consectetur
                adipisicing
                elit. Delectus eius laboriosam magni neque obcaecati provident rem
                repellendus. Consequuntur dolorem, excepturi illum iste maxime modi
                nesciunt
                pariatur, sed sunt tempora, ullam?
            </div>

        </div>
        <div
            className="mt-4 mb-2 font-bold flex flex-wrap w-full text-[0.7rem] leading-4">
            <div
                className="rounded bg-[#DDD9DF] mr-2 mb-1 ml py-0.5 px-4 w-fit h-fit whitespace-nowrap">Факультет
            </div>
            <div
                className="rounded bg-[#F9C5D3] mr-2 mb-1 py-0.5 px-4 w-fit whitespace-nowrap">Семестр
                1
            </div>
            <div
                className="rounded bg-[#FEB3B4] mr-2 mb-1 py-0.5 px-4 w-fit whitespace-nowrap">МатАнализ
            </div>
            <div
                className="rounded bg-[#F4BDE6] mr-2 mb-1 py-0.5 px-4 w-fit whitespace-nowrap">Препод
            </div>
            <div
                className="rounded bg-[#C7A8F3] mr-2 mb-1 py-0.5 px-4 w-fit whitespace-nowrap">Экзамен
            </div>
        </div>
        <div
            className="flex flex-wrap md:flex-nowrap font-semibold relative">
            <div
                className="md:absolute md:right-0 flex space-x-4 md:mb-0 mb-2 my-auto text-[1.0rem] mt-0.5 inline-block items-center w-full md:w-fit">
                <div className="font-medium">exam_file_1.pdf (50 MB)</div>
                <div className="h-4 flex w-4 -mt-0.5">
                    <Image
                        src={DownloadIco}
                        alt="Comment"
                    />
                </div>

            </div>
            <div className="flex space-x-4 font-semibold w-full md:w-fit">
                <LikeComponent/>
                <DislikeComponent/>
                <CommentComponent/>
            </div>

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



