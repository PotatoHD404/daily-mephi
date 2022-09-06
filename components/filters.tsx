import React from "react";
import Button from "@mui/material/Button";
import Image from "next/image";
import FiltersIco from "../images/filters.svg";
import SortIco from "../images/sort.svg";

export function Filters() {
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


function CustomButton(props: { children: React.ReactNode }) {
    return <Button className="rounded-full text-black font-[Montserrat] font-bold text-center
                                              w-fit normal-case h-8">
        {props.children}
    </Button>;
}

export function FilterButtons() {
    return <div className="md:hidden w-full mb-1 ml-2 flex justify-between">
        <CustomButton>
            <div className="flex w-5 mb-[1px] mr-2">
                <Image
                    src={FiltersIco}
                    alt="Filters ico"
                    className="my-auto"
                />
            </div>
            <div>Фильтры</div>
        </CustomButton>
        <CustomButton>
            <div className="flex w-5 mb-[1px] mr-2">
                <Image
                    src={SortIco}
                    alt="Sort ico"
                    className="my-auto"
                />
            </div>
            <div>Популярные</div>
        </CustomButton>
    </div>;
}
