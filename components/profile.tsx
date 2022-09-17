import React from "react";
import TopUsers from "./topUsers";
import Image from "next/future/image";
import ProfileImage from "images/profile1.webp";
import RippledButton from "./rippledButton";
import QuestionIco from "images/question.svg";
import RatingPlace from "./ratingPlace";



import {Divider, Skeleton, Tooltip} from '@mui/material';
import {useSession} from "next-auth/react";
import {useQuery} from "@tanstack/react-query";
import {useRouter} from "next/router";
import useIsMobile from "../helpers/react/isMobileContext";


function User(props: { name?: string, userCourse?: string, rating?: number, reviews?: number, materials?: number, quotes?: number, avatar?: string, place?: number, role?: string }) {
    props.userCourse = props.userCourse?.replace("B", "Б").replace("C", "С").replace("M", "М").replace("A", "А") || "Курс не указан";
    // Tooltip opens on hover
    const isMobile = useIsMobile();
    const [open, setOpen] = React.useState(false);
    return (
        <div className="w-full normal-case h-fit whiteBox p-5 px-4">
            <div className="md:block absolute -mr-1 -mt-1">
                <RatingPlace place={props.place || 47}/>
            </div>

            <div className="flex xs:flex-nowrap flex-wrap mt-10 w-full md:h-[18.2rem]">
                <div className="xs:ml-3 mx-auto md:mt-0 xs:mt-3 -mt-10">
                    <div className="md:w-[18.2rem] w-[14rem]">
                        <Image
                            src={props.avatar || ProfileImage}
                            alt="Profile image"
                            className="rounded-full my-auto w-[18.2rem]"
                        />
                    </div>
                </div>

                <div className="xs:ml-6 ml-3 xs:mt-0 mt-4 xs:max-w-[30rem] xs:w-fit flex flex-wrap items-stretch text-lg md:text-xl
                 my-auto h-[15rem] xs:text-left text-center">
                    <div className="w-full">
                        <div className="xs:text-left h-fit text-2xl font-bold mb-1">
                            {props.name || 'Имя'}
                        </div>
                        <Divider/>
                    </div>
                    <div className="w-full font-semibold">
                        {`${props.role == "tutor" ? "Преподаватель" : "Студент / " + (props.userCourse || 'Курс')}`}
                    </div>
                    {!isMobile ? <>
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
                                           className="w-6 h-6"/>
                                </RippledButton>
                            </div>
                        </Tooltip>
                    </div>
                </div>
            </div>
        </div>);
}

export default function Profile() {
    async function getUser() {
        return await (await fetch('/api/v1/users/me', {
            method: 'GET',
            credentials: 'same-origin'
        }))?.json();
    }

    const {data, isFetching, isError, error} = useQuery(['me'], getUser, {
        refetchOnWindowFocus: false,
        enabled: true // disable this query from automatically running
    });
    if (isError) {
        // console.log(`Ошибка ${error}`)
        const router = useRouter();
        router.push('/500');
    }
    if(!isFetching)
        console.log(data);

    return <div className="flex">
        <div className="lg:mr-8 -mt-2 lg:w-[80%] w-full">
            {isFetching ? <Skeleton variant="rectangular" width="100%" height="100%"/> :
                /* @ts-ignore */
                <User {...data}/>
            }
        </div>
        <div className="ml-auto hidden lg:block">
            <TopUsers/>
        </div>
    </div>;
}
