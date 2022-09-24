import React, {useEffect, useState} from "react";
import DeadCat from "images/dead_cat.svg";
import Image from "next/image";
import HoverRating from "components/rating";

import QuoteIco from "images/quote.svg";
import SEO from "components/seo";
import Like from "components/likeBtn";
import Dislike from "components/dislikeBtn";
import Comments from "components/comments";
import UserHeader from "components/userHeader";
import TabsBox from "components/tabsBox";
import Reactions from "components/reactions";
import Material from "components/material";
import NewPost from "components/newPost";
import RippledButton from "components/rippledButton";
import RatingPlace from "components/ratingPlace";
import dynamic from "next/dynamic";
import useIsMobile from "helpers/react/isMobileContext";
import {getCache, setCache} from "../../helpers/utils";
import {useSession} from "next-auth/react";
import prisma from "../../lib/database/prisma";
import {Skeleton} from "@mui/material";
import {useQuery} from "@tanstack/react-query";
import {useRouter} from "next/router";

const PostDialog = dynamic(() => import("components/postDialog"), {ssr: false});

function RatingComponent(props: { text: string, rate: string, isLoading?: boolean }) {
    if(props.isLoading) {
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

function Quote(props: { onClick: () => void }) {
    return <div className="flex-wrap space-y-10 w-full">
        <div className="space-y-10">
            <NewPost placeholder={"Загрузить цитату"} onClick={props.onClick}/>
            <div className="text-xl w-full whiteBox">
                <UserHeader name={"User1"}
                            date={"15 февраля 2022"}/>
                <div className="relative flex">
                    <div className="h-4 w-4">
                        <Image
                            src={QuoteIco}
                            alt="Quote symbol"
                        />
                    </div>
                    <div className="italic w-[80%] mx-auto">Lorem ipsum dolor sit amet,
                        consectetur
                        adipisicing
                        elit. Delectus eius laboriosam magni neque obcaecati provident rem
                        repellendus. Consequuntur dolorem, excepturi illum iste maxime modi
                        nesciunt
                        pariatur, sed sunt tempora, ullam?
                    </div>
                    <div className="h-4 w-4 mt-auto">
                        <Image
                            src={QuoteIco}
                            alt="Quote symbol"
                            className="rotate-180"
                        />
                    </div>
                </div>
                <div className="text-center my-2 font-semibold italic">Трифоненков В.П.</div>
                <div className="flex space-x-4 font-semibold">
                    <Like/>
                    <Dislike/>
                </div>
            </div>
        </div>
    </div>;
}


function Review(props: { onClick: () => void }) {
    return <div className="flex-wrap space-y-10 w-full">
        <NewPost placeholder={"Оставить отзыв"} onClick={props.onClick}/>


        <div className="text-[1.7rem] w-full whiteBox">
            <UserHeader name={"User1"}
                        date={"15 февраля 2022"}/>
            <h1 className="font-bold text-[1.1rem] leading-6">Заголовок</h1>
            <div className="mb-2 text-[1.0rem] leading-5">Lorem ipsum dolor sit amet,
                consectetur adipisicing elit.
                Adipisci
                aut autem
                dolores dolorum enim esse excepturi fugit, inventore laboriosam magnam nihil
                officiis possimus qui recusandae repudiandae sed sequi sunt temporibus.
            </div>
            <Reactions/>
            <div className="w-full bg-black mx-auto mb-4 h-[2px]"/>
            <Comments/>
        </div>
    </div>;
}


function Tutor({tutor}: { tutor: any }) {
    // const router = useRouter();
    // const {id} = router.query;
    const session = useSession();
    const [value, setValue] = React.useState(0);
    const [postValue, setPostValue] = React.useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
        setPostValue(newValue);
    };
    const [open, setOpen] = useState(false)
    const isMobile = useIsMobile();

    async function getTutor() {
        return await (await fetch(`/api/v1/tutors/${tutor.id}`, {
            method: 'GET',
            credentials: 'same-origin'
        }))?.json();
    }

    const {data, isFetching, refetch, isError, error} = useQuery([`tutor-${tutor.id}`], getTutor, {
        cacheTime: 0,
        refetchOnWindowFocus: false,
        enabled: false // disable this query from automatically running
    });
    const isLoading = isFetching || !data;
    const router = useRouter();
    useEffect(() => {
        refetch();
    }, [router.pathname, refetch])
    useEffect(() => {
        if (isError && error) {
            // console.log(`Ошибка ${error}`)
            console.log(error)
            // router.push('/500');
        }
    }, [isError, error, router])
    const authenticating = session.status === 'loading';
    const authenticated = session.status === 'authenticated';
    // constructor(props: any) {
    //     super(props);
    //     this.state = {id: ''};
    // }
    //
    // static getDerivedStateFromProps(props: any, state: any) {
    //     return {...state, id: props.router.query.id};
    // }

    // bg-white bg-opacity-[36%]
    // bg-white bg-opacity-[80%]
    // ID: {this.state.id}
    return (
        <>
            {/*<SEO title={'Трифоненков В.П.'} card={`https://daily-mephi.vercel.app/api/cover?type=tutor&id=${id}`}/>*/}
            <SEO title={'Трифоненков В.П.'}
                 thumbnail={`https://daily-mephi.ru/api/v1/thumbnails/tutors/${tutor.id}.png`}/>
            {isMobile == null ? null :
                <>
                    <PostDialog opened={open} handleClose={() => setOpen(false)} defaultValue={value} value={postValue}
                                setValue={setPostValue}/>
                    <div className="flex-wrap w-full">
                        <div className="flex flex-wrap whiteBox overflow-x-hidden">

                            {/*<div className="font-bold text-[1.0rem] xs:text-lg w-full text-justify mx-auto mb-5 greenBox whitespace-nowrap flex justify-between max-w-[25.0rem]">*/}
                            {/*    <div>Трифоненков</div>*/}
                            {/*    <div>Владимир</div>*/}
                            {/*    <div>Петрович</div>*/}
                            {/*</div>*/}
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
                                            {tutor.disciplines.join(', ')}
                                        </h2>
                                    </div> : null}
                                    {tutor.faculties.length > 0 ? <div className="w-full">
                                        <h2 className="font-semibold">Факультеты:</h2>
                                        <h2 className="my-2">
                                            {tutor.faculties.join(', ')}
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
                                                    <div>{data.rating}</div>
                                                </div>
                                                <div className="my-auto flex w-full justify-between">
                                                    <div className="font-semibold">mephist.ru:</div>
                                                    <div>{data.legacyRating || "-"}</div>
                                                </div>
                                            </>}
                                    </div>
                                    {
                                        (tutor.disciplines.length + tutor.faculties.length) == 0 ?
                                        <h2 className="font-semibold text-xl opacity-50 w-full mt-4 -mb-4">Информация о
                                            преподавателе отсутствует</h2> : null
                                    }
                                </div>
                            </div>
                            <div className="w-full h-[1px] bg-black my-3"/>
                            { 
                            authenticating || authenticated ?
                            <div className="w-full space-y-1 font-semibold md:max-w-[37.7rem]">
                                <RatingComponent text="Характер" rate="(4.6)" isLoading={authenticating}/>
                                <RatingComponent text="Преподавание" rate="(4.6)" isLoading={authenticating}/>
                                <RatingComponent text="Пунктуальность" rate="(4.6)" isLoading={authenticating}/>
                                <RatingComponent text="Прием экзаменов" rate="(4.6)" isLoading={authenticating}/>
                                {authenticating ? 
                                <Skeleton className="w-[25rem] h-7" variant="rounded"/> :
                                <div
                                    className="rounded-full w-auto border-2 border-black
                             font-bold text-center md:max-w-[25.0rem] md:text-lg text-sm max-w-[7.5rem] md:mx-0 ml-auto">
                                    <RippledButton onClick={() => {
                                    }}>
                                        <div>Отправить</div>
                                    </RippledButton>
                                </div>
                            }
                            </div> :
                            null
                            }

                        </div>
                        <div className="w-full mt-7">
                            <TabsBox value={value} onChange={handleChange}
                                     tabs={['Отзывы', 'Цитаты', 'Материалы']}/>

                            <div className="mt-6 mx-auto">
                                {value == 0 ?
                                    <Review onClick={() => setOpen(true)}/>
                                    : null}
                                {value == 1 ?
                                    <Quote onClick={() => setOpen(true)}/>
                                    : null}
                                {value == 2 ? <>
                                        <div className="mb-10">
                                            <NewPost placeholder={"Загрузить материал"}
                                                     onClick={() => setOpen(true)}/>
                                        </div>

                                        <Material/>
                                    </>
                                    : null}
                            </div>
                        </div>
                    </div>
                </>
            }
        </>);
}

export async function getStaticPaths() {
    const tutors = await prisma.tutor.findMany({
        select: {
            id: true,
            firstName: true,
            lastName: true,
            fatherName: true,
            disciplines: {
                select: {
                    name: true
                }
            },
            faculties: {
                select: {
                    name: true
                }
            },
            images: {
                select: {
                    url: true
                }
            }
        }
    });
    await setCache(tutors, "tutors");
    return {
        paths: tutors.map((tutor) =>
            ({params: {id: tutor.id}})
        ),
        fallback: false, // can also be true or 'blocking'
    }
}

export async function getStaticProps(context: any) {
    const {id} = context.params;
    const tutor: any = await getCache(id, "tutors");
    if (!tutor) {
        return {
            notFound: true
        }
    }
    tutor.images = tutor.images.map((image: any) => image.url);
    tutor.disciplines = tutor.disciplines.map((image: any) => image.name);
    tutor.faculties = tutor.faculties.map((image: any) => image.name);
    // console.log(tutor)
    return {
        // Passed to the page component as props
        props: {tutor},
    }
}


export default Tutor;
