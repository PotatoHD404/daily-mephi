import UserHeader from "./userHeader";
import Image from "next/image";
import DownloadIco from "images/download.svg";
import Reactions from "./reactions";
import React from "react";
import {IconButton} from '@mui/material';

export default function Material() {
    return <>
        <div className="whiteBox text-xl w-full mt-4 pb-2">
        <UserHeader date={new Date()}/>
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
            className="mt-2.5 mb-2 font-bold flex flex-wrap w-full text-[0.9rem] leading-4">
            <div className="bg-[#DDD9DF] bg-[#F9C5D3] bg-[#FEB3B4]
             bg-[#F4BDE6] bg-[#C7A8F3] hidden"></div>
            {
                [
                    {label: "Факультет", color: "#DDD9DF"}
                    , {label: "Семестр", color: "#F9C5D3"}
                    , {label: "МатАнализ", color: "#FEB3B4"}
                    , {label: "Препод", color: "#F4BDE6"}
                    , {label: "Экзамен", color: "#C7A8F3"}
                ].map((tag, index) => (
                    <div className={`rounded bg-[${tag.color}] mr-2 mb-1 py-1 px-4 w-fit whitespace-nowrap`}
                         key={index}>
                        {tag.label}
                    </div>
                ))
            }
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
    </div>
    </>;
}
