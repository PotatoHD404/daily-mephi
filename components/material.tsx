import UserHeader from "./userHeader";
import Image from "next/image";
import DownloadIco from "images/download.svg";
import Reactions from "./reactions";
import React from "react";
import IconButton from "@mui/material/IconButton";

export default function Material() {
    return <div className="whiteBox text-xl w-full mt-4 pb-2">
        <UserHeader name={"User1"}
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
                <IconButton
                    onClick={undefined}
                    className="h-8 flex w-8 -mt-0.5"
                >
                    <Image
                        src={DownloadIco}
                        alt="Download icon"
                    />
                </IconButton>
            </div>
            <Reactions/>

        </div>
    </div>;
}
