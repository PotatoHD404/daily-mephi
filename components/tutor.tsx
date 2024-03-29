import Link from "next/link";
import Image from "next/image";
import TutorImage from "images/tutor.png";
import StarIcon from "images/star.svg";
import ReviewsIco from "images/reviews.svg";
import QuotesIco from "images/quotes.svg";
import MaterialsIco from "images/materials.svg";
import React from "react";
import RatingPlace from "./ratingPlace";
import {Box, Button, Skeleton} from '@mui/material';

import useIsMobile from "lib/react/isMobileContext";

interface TutorProps {
    loading: boolean;
    tutorId: string;
    name: string;
    image: string; // Assuming this is always required. Make it optional if not.
    rating?: number;
    disciplines: string[];
    department?: string;
    reviewsCount?: number;
    materialsCount?: number;
    quotesCount?: number;
    place?: number;
}
export function LoadingTutor() {
    return (
        <Box className="p-5 px-4 w-full whiteBox mt-4">
            {/* Mimic the header section with the rating place and tutor name */}
            <Box className="flex justify-between mb-3">
                <Skeleton variant="circular" width={50} height={50} />
                <Box className="flex-grow ml-4">
                    <Skeleton variant="text" width="90%" height={20} />
                    <Skeleton variant="text" width="60%" height={20} />
                </Box>
            </Box>

            {/* Mimic the disciplines and department section */}
            <Box>
                <Skeleton variant="text" width="100%" height={20} />
                <Skeleton variant="text" width="80%" height={20} />
                <Skeleton variant="text" width="90%" height={20} />
                <Skeleton variant="text" width="70%" height={20} />
            </Box>

            {/* Mimic the additional information for mobile and desktop */}
            <Box className="flex flex-wrap mt-4">
                <Skeleton variant="rectangular" width="45%" height={10} className="mr-2" />
                <Skeleton variant="rectangular" width="45%" height={10} className="mr-2" />
            </Box>
        </Box>
    );
}

export default function Tutor({loading, tutorId, place}: TutorProps) {
    const isMobile = useIsMobile();
    return (
        <Link href={`/tutors/${tutorId}`}>

            <Button className="text-black font-[Montserrat] text-center
                                              w-fit normal-case h-fit flex flex-wrap active:bg-white
                                              overflow-x-hidden mt-4
                                              whiteBox p-5 px-4">
                <div className="flex justify-start items-center w-full text-lg mb-3 relative">
                    <div className="absolute md:relative right-0 top-0 md:mt-0 -mt-2 md:mr-0 -mr-2">
                        <RatingPlace place={47}/>
                    </div>
                    <div className="flex items-center space-x-3 md:mx-5">
                        <div className="flex md:w-12 w-24">
                            <Image
                                src={TutorImage}
                                alt="Tutor image"
                                className="rounded-full my-auto"
                            />
                        </div>
                        <div className="mt-4 md:mt-0">
                            <div className="text-center h-fit">
                                Трифоненков В. П.
                            </div>
                            {isMobile ? <div
                                className="items-center justify-between align-middle md:mx-5 flex w-fit">
                                <div className="mr-2">5.0</div>
                                <div className="flex w-4 mb-[1px]">
                                    <Image
                                        src={StarIcon}
                                        alt="Tutor image"
                                        className="my-auto"
                                    />
                                </div>
                            </div> : null}

                        </div>
                    </div>
                    {!isMobile ?
                        <div className="flex items-center justify-between align-middle mx-5">
                            <div className="mr-2">5.0</div>
                            <div className="flex w-5 mb-[1px]">
                                <Image
                                    src={StarIcon}
                                    alt="Tutor image"
                                    className="my-auto"
                                />
                            </div>
                        </div> : null}
                    <div className="flex-wrap lg:flex hidden">
                        <div className="mr-4">{`Отзывов: ${5}`}</div>
                        <div className="mr-4">{`Материалов: ${5}`}</div>
                        <div className="mr-4">{`Цитат: ${5}`}</div>
                    </div>
                </div>

                <div className="flex flex-wrap w-fit h-fit md:text-xl text-[1.0rem] mr-auto">
                    <div className="h-fit mb-2 text-left flex flex-wrap">
                        <span className="font-bold h-fit mr-2 text-[1.1rem]">Дисциплины: </span>
                        {["Теория функций копмплексных переменных",
                            "Математический анализ",
                            "Линейная алгебра",
                            "Интегральные уравнения",
                            "Дифференциальные уравнения"
                        ].map((discipline, index) => {
                            return <span key={index} className="text-[1.0rem] mr-2">
                                {`${discipline}${index !== 4 ? ", " : ""}`}
                            </span>
                        })}
                    </div>

                    <div className="flex w-full max-w-[7.0rem] md:max-w-[8.0rem] justify-between">
                        <div className="font-bold text-[1.1rem] h-fit">Кафедра:</div>
                        <div className="text-[1.0rem] -mb-[2px] mt-[2px]">30</div>
                    </div>
                </div>
                {isMobile ?
                    <div className="flex flex-wrap mt-2 text-sm">
                        <div className="mr-4 mt-1">
                            <div className="flex items-center justify-between align-middle">
                                <div className="flex w-5 mb-[1px]">
                                    <Image
                                        src={ReviewsIco}
                                        alt="Reviews ico"
                                        className="my-auto"
                                    />
                                </div>
                                <div className="ml-2 font-semibold">5</div>
                                <div className="ml-3 xs:block hidden">Отзывов</div>
                            </div>
                        </div>
                        <div className="mr-4 mt-1">
                            <div className="flex items-center justify-between align-middle">
                                <div className="flex w-5 mb-[1px]">
                                    <Image
                                        src={QuotesIco}
                                        alt="Quotes ico"
                                        className="my-auto"
                                    />
                                </div>
                                <div className="ml-2 font-semibold">3</div>
                                <div className="ml-3 xs:block hidden">Цитаты</div>
                            </div>
                        </div>
                        <div className="mr-4 mt-1">
                            <div className="flex items-center justify-between align-middle">
                                <div className="flex w-3.5 mb-[1px]">
                                    <Image
                                        src={MaterialsIco}
                                        alt="Materials ico"
                                        className="my-auto"
                                    />
                                </div>
                                <div className="ml-2 font-semibold">3</div>
                                <div className="ml-3 xs:block hidden">Материала</div>
                            </div>
                        </div>
                    </div> : null}
            </Button>
        </Link>
    );
}
