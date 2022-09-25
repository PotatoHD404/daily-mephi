import React from "react";
import Image from "next/future/image";
import DeadCat from "images/dead_cat.svg";
import RippledButton from "./rippledButton";
import QuestionIco from "images/question.svg";
import RatingPlace from "./ratingPlace";


import {ButtonBase, Divider, Skeleton, Tooltip} from '@mui/material';
import useIsMobile from "../lib/react/isMobileContext";
import {signOut} from "next-auth/react";

export default function User(props: { name?: string, userCourse?: string, rating?: number, reviews?: number, materials?: number, quotes?: number, image?: string, place?: number, role?: string, me?: boolean, isLoading?: boolean }) {
    props.userCourse = props.userCourse?.replace("B", "Б").replace("C", "С").replace("M", "М").replace("A", "А") || "Курс не указан";
    // Tooltip opens on hover
    const isMobile = useIsMobile();
    const [open, setOpen] = React.useState(false);
    return (
        <div className="w-full normal-case h-fit whiteBox p-5 px-4">
            {
                <div className="md:block absolute -mr-1 -mt-1">
                    <RatingPlace place={props.place || 47} isLoading={props.isLoading}/>
                </div>
            }

            <div className="flex xs:flex-nowrap flex-wrap mt-10 w-full md:h-[18.2rem]">
                <div className="xs:ml-3 mx-auto md:mt-0 xs:mt-3 -mt-10">
                    {
                        props.isLoading && !props.image ? <Skeleton variant="circular"
                                                                    className="md:w-[18.2rem] w-[14rem] md:h-[18.2rem] h-[14rem]"/> :
                            <div className="md:w-[18.2rem] w-[14rem]">
                                <Image
                                    src={props.image || DeadCat}
                                    alt="Profile image"
                                    className="rounded-full my-auto w-[18.2rem]"
                                    height={500}
                                    width={500}
                                />
                            </div>
                    }
                </div>

                <div className={`xs:ml-6 ml-3 xs:mt-0 mt-4 xs:max-w-[30rem] xs:w-fit flex flex-wrap items-stretch text-lg md:text-xl
                    my-auto h-[15rem] xs:text-left text-center`}>
                    <div className="flex flex-wrap h-[15rem]">
                        <div className="w-full">
                            {
                                props.isLoading && !props.name ? <Skeleton className="xs:mr-auto h-fit h-7 mb-1 w-40"
                                                                           variant="rounded"/> :
                                    <div className="xs:text-left h-fit text-2xl font-bold mb-1">
                                        {props.name || 'Имя'}
                                    </div>
                            }
                            <Divider/>
                        </div>
                        {
                            props.isLoading ? <Skeleton className="w-60 h-7" variant="rounded"/> :
                                <div className="w-full font-semibold">
                                    {`${props.role == "tutor" ? "Преподаватель" : "Студент "}`}
                                </div>
                        }

                        {props.isLoading ? <div className="space-y-3 w-full">
                            <Skeleton className="w-80 h-7" variant="rounded"/>
                            <Skeleton className="w-80 h-7" variant="rounded"/>
                            <Skeleton className="w-80 h-7" variant="rounded"/>
                        </div> : !isMobile ? <>
                            <div className="w-full">
                                {`Загружено материалов: ${props.materials || 0}`}
                            </div>
                            <div className="w-full">
                                {`Написано отзывов: ${props.reviews || 0}`}
                            </div>
                            <div className="w-full">
                                {`Загружено цитат: ${props.quotes || 0}`}
                            </div>
                        </> : <>
                            <div className="w-full">
                                {`Материалов: ${props.materials || 0}`}
                            </div>
                            <div className="w-full">
                                {`Отзывов: ${props.reviews || 0}`}
                            </div>
                            <div className="w-full">
                                {`Цитат: ${props.quotes || 0}`}
                            </div>
                        </>}
                        {
                            props.isLoading ? <Skeleton className="w-80 h-7" variant="rounded"/> :
                                <div className="xs:w-full flex xs:mx-0 mx-auto w-fit">
                                    <div className="h-fit my-auto">{`Рейтинг: ${props.rating || 0}`}</div>
                                    <Tooltip
                                        title={
                                            <div className="text-sm">
                                                Рейтинг начисляется за выложенные материалы, отзывы и цитаты
                                            </div>
                                        }
                                        open={open}
                                        onOpen={() => setOpen(true)}
                                        onClose={() => setOpen(false)}
                                    >
                                        <div className="ml-2 my-auto">
                                            <RippledButton
                                                onClick={() => setOpen(!open)}
                                            >
                                                <Image src={QuestionIco}
                                                       alt="Question icon"
                                                       className="w-6 h-6"
                                                />
                                            </RippledButton>
                                        </div>
                                    </Tooltip>
                                </div>
                        }
                    </div>

                    {
                        props.me ?
                            <div className="w-fit mt-3">
                                <div className={`rounded-full border-2 
                                 font-bold text-center border-black text-red-600 w-32 h-fit`}>
                                    <ButtonBase className={"w-full h-full rounded-full p-0.5"}
                                                onClick={() => signOut()}
                                    >Выйти</ButtonBase>
                                </div>
                            </div>
                            : null
                    }
                </div>
            </div>
        </div>);
}
