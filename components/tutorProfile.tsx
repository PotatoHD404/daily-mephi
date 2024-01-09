import useSendQuery from "../lib/react/useSendQuery";
import {useSession} from "next-auth/react";
import Image from "next/image";
import DeadCat from "../images/dead_cat.svg";
import RatingPlace from "./ratingPlace";
import {Skeleton} from "@mui/material";
import RippledButton from "./rippledButton";
import React from "react";
import HoverRating from "./rating";

function RatingComponent(props: { text: string, rate: string, isLoading?: boolean }) {
    if (props.isLoading) {
        return (
            <Skeleton className="w-[25rem] h-7" variant="rounded"/>
        );
    }
    return (
        <div className="flex justify-between w-auto text-[0.9rem] md:text-lg">
            <div className="flex">
                <div className="w-fit h-fit">{props.text}</div>
                <div className="w-fit h-fit hidden xs:block">{props.rate}</div>
                <div className="w-fit h-fit">:</div>
            </div>
            <div className="w-fit"><HoverRating/></div>
        </div>)
        ;
}

export default function TutorProfile({tutor}: { tutor: any }) {
    async function getTutor() {
        return await fetch(`/api/v1/tutors/${tutor.id}`, {
            method: 'GET',
            credentials: 'same-origin'
        }).then(el => el?.json());
    }

    const {data, isFetching} = useSendQuery(`tutor-${tutor.id}`, getTutor);
    const isLoading = isFetching || !data;
    const session = useSession();
    const authenticating = session.status === 'loading';
    const authenticated = session.status === 'authenticated';

    return <div className="flex flex-wrap whiteBox overflow-x-hidden">
        <div className="flex items-center w-full mb-2">
            <div className="mb-3 w-16 h-14 md:w-60 md:hidden justify-self-start">
                <Image
                    src={tutor.images[0] ?? DeadCat}
                    alt="Tutor image"
                    className="rounded-full z-0"
                    width={458}
                    height={458}
                />

            </div>
            <h1 className="font-bold text-[1.0rem] xs:text-lg md:text-2xl
                         mx-auto md:mb-5 text-center h-fit ">
                {`${tutor.lastName} ${tutor.firstName} ${tutor.fatherName}`}
            </h1>
        </div>
        <div className="hidden md:block -ml-2 -mt-2 absolute">
            <RatingPlace place={47}/>
        </div>
        <div className="flex flex-nowrap items-center">
            <div className="flex items-center w-fit hidden mr-4 md:block">
                <div className="w-fit text-[1.0rem] md:text-xl font-bold h-fit md:flex-row-reverse">
                    <div className="flex mb-3 w-32 md:w-60">
                        <Image
                            src={tutor.images[0] ?? DeadCat}
                            alt="Tutor image"
                            className="rounded-full z-0"
                            width={458}
                            height={458}
                        />
                    </div>
                    <div className="flex space-x-2 items-center justify-center md:hidden">
                        <RatingPlace place={47}/>
                        <div className="font-semibold">место</div>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap w-fit h-fit md:text-xl">
                {tutor.disciplines.length > 0 ? <div className="w-full">
                    <h2 className="font-semibold">Дисциплины:</h2>
                    <h2 className="my-2">
                        {tutor.disciplines.join(", ")}
                    </h2>
                </div> : null}
                {tutor.faculties.length > 0 ? <div className="w-full">
                    <h2 className="font-semibold">Факультеты:</h2>
                    <h2 className="my-2">
                        {tutor.faculties.join(", ")}
                    </h2>
                </div> : null}
                <div className="flex flex-wrap space-y-1 w-full pr-4 md:max-w-[14rem]">
                    {isLoading ?
                        <>
                            <Skeleton className="w-[14rem] h-7" variant="rounded"/>
                            <Skeleton className="w-[14rem] h-7" variant="rounded"/>
                        </> :
                        <>
                            <div className="my-auto flex w-full justify-between">
                                <div className="font-semibold">Daily Mephi:</div>
                                {/*<div>{data.rating}</div>*/}
                            </div>
                            <div className="my-auto flex w-full justify-between">
                                <div className="font-semibold">mephist.ru:</div>
                                {/*<div>{data.legacyRating || "-"}</div>*/}
                            </div>
                        </>}
                </div>
                {
                    (tutor.disciplines.length + tutor.faculties.length) == 0 ?
                        <h2 className="font-semibold text-xl opacity-50 w-full mt-4">Информация
                            о
                            преподавателе отсутствует</h2> : null
                }
            </div>
        </div>
        <div className="w-full h-[1px] bg-black my-3"/>
        {authenticating || authenticated ?
            <div className="w-full space-y-1 font-semibold md:max-w-[37.7rem]">
                <RatingComponent text="Характер" rate="(4.6)" isLoading={authenticating}/>
                <RatingComponent text="Преподавание" rate="(4.6)" isLoading={authenticating}/>
                <RatingComponent text="Пунктуальность" rate="(4.6)" isLoading={authenticating}/>
                <RatingComponent text="Прием экзаменов" rate="(4.6)" isLoading={authenticating}/>
                {authenticating ?
                    <Skeleton className="w-[25rem] h-7" variant="rounded"/> :
                    <div
                        className="rounded-full w-auto border-2 border-black
                                                font-bold text-center md:max-w-[25.0rem] md:text-lg
                                                 text-sm max-w-[7.5rem] md:mx-0 ml-auto">
                        {/* TODO: add action */}
                        <RippledButton onClick={() => {
                        }}>
                            <div>Отправить</div>
                        </RippledButton>
                    </div>
                }
            </div> :
            null
        }

    </div>;
}
