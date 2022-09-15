import React from "react";
import TopUsers from "./topUsers";
import Image from "next/future/image";
import ProfileImage from "images/profile1.png";
import RippledButton from "./rippledButton";
import QuestionIco from "images/question.svg";
import RatingPlace from "./ratingPlace";
import useMediaQuery from "helpers/react/useMediaQuery";


import { Divider, Tooltip } from '@mui/material';



function User() {
    const isMobile = useMediaQuery(768);
    return (
        <div className="w-full normal-case h-fit whiteBox p-5 px-4">
            <div className="md:block absolute -mr-1 -mt-1">
                <RatingPlace place={47}/>
            </div>

            <div className="flex xs:flex-nowrap flex-wrap mt-10 w-full md:h-[18.2rem]">
                <div className="xs:ml-3 mx-auto md:mt-0 xs:mt-3 -mt-10">
                    <div className="md:w-[18.2rem] w-[14rem]">
                        <Image
                            src={ProfileImage}
                            alt="Profile image"
                            className="rounded-full my-auto w-[18.2rem]"
                        />
                    </div>
                </div>

                <div className="xs:ml-6 ml-3 xs:mt-0 mt-4 xs:max-w-[30rem] xs:w-fit flex flex-wrap items-stretch text-lg md:text-xl
                 my-auto h-[15rem] xs:text-left text-center">
                    <div className="w-full">
                        <div className="xs:text-left h-fit text-2xl font-bold mb-1">
                            PotatoHD
                        </div>
                        <Divider/>
                    </div>
                    <div className="w-full font-semibold">
                        Студент / 3 курс
                    </div>
                    {!isMobile ? <>
                    <div className="w-full block">
                        Загружено материалов: 34
                    </div>
                    <div className="w-full">
                        Написано отзывов: 12
                    </div>
                    <div className="w-full">
                        Загружено цитат: 10
                    </div> </> : <>
                    <div className="w-full">
                        Материалов: 34
                    </div>
                    <div className="w-full">
                        Отзывов: 12
                    </div>
                    <div className="w-full">
                        Цитат: 10
                    </div></> }

                    <div className="xs:w-full flex xs:mx-0 mx-auto w-fit">
                        <div className="h-fit my-auto">Рейтинг: 250</div>
                        <Tooltip enterTouchDelay={0}
                                 title={
                                     <div className="text-sm">Рейтинг начисляется за выложенные материалы, отзывы и
                                         цитаты</div>
                                 }>
                            <div className="ml-2 my-auto">
                                <RippledButton
                                    onClick={() => {
                                    }}
                                >
                                    <Image src={QuestionIco}
                                           alt="Question icon"
                                           className="w-6 h-6"/>
                                </RippledButton>
                            </div>
                        </Tooltip>


                    </div>
                    {/*    divider   */}


                </div>
            </div>


        </div>);
}

export default function Profile() {
    return <div className="flex">
        <div className="lg:mr-8 -mt-2 lg:w-[80%] w-full">
            <User/>
        </div>
        <div className="ml-auto hidden lg:block">
            <TopUsers/>
        </div>
    </div>;
}
