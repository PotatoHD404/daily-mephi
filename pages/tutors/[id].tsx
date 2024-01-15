import React, {useEffect, useState} from "react";
import Image from "next/image";

import QuoteIco from "images/quote.svg";
import SEO from "components/seo";
import Like from "components/likeBtn";
import Dislike from "components/dislikeBtn";
import UserHeader from "components/userHeader";
import TabsBox from "components/tabsBox";
import Material from "components/material";
import NewPost from "components/newPost";
import dynamic from "next/dynamic";
import useIsMobile from "lib/react/isMobileContext";
import {getCache, setCache} from "../../lib/utils";
import {prisma} from "../../lib/database/prisma";
import TutorProfile from "../../components/tutorProfile";
import Reviews from "../../components/reviews";
import {useRouter} from "next/router";

const PostDialog = dynamic(() => import("components/postDialog"), {ssr: false});

function Quote() {
    return (<div className="text-xl w-full whiteBox">
        <UserHeader legacyNickname={"User1"}
                    date={new Date()} isLoading={true}/>
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
            <Like count={0}/>
            <Dislike count={0}/>
        </div>
    </div>);
}

function Tabs(props: { tutorId: any }) {
    const newPostPlaceholders = {
        0: "Оставить отзыв",
        1: "Загрузить цитату",
        2: "Загрузить материал"
    }
    const router = useRouter();

    const [value, setValue] = React.useState<0 | 1 | 2>(0);
    const [postValue, setPostValue] = React.useState(0);
    const handleChange = (_: React.SyntheticEvent | null, newValue: 0 | 1 | 2) => {
        setValue(newValue);
        setPostValue(newValue);
    };
    useEffect(() => {
        if (router.query?.review) {
            handleChange(null, 0);
        } else if (router.query?.quote) {
            handleChange(null, 1);
        } else if (router.query?.material) {
            handleChange(null, 2);
        }
    }, [router.query]);
    const [open, setOpen] = useState(false)

    return (
        <>
            <PostDialog opened={open} handleClose={() => setOpen(false)} defaultValue={value} value={postValue}
                        setValue={setPostValue}/>
            <TabsBox value={value}
                     onChange={handleChange as any}
                     tabs={["Отзывы", "Цитаты", "Материалы"]}/>

            <div className="mt-6 mx-auto">
                <div className="flex-wrap space-y-4 w-full">
                    <NewPost placeholder={newPostPlaceholders[value]} onClick={() => setOpen(true)}/>
                    {value == 0 ?
                        <Reviews tutorId={props.tutorId}/>
                        : null}
                    {value == 1 ?
                        <>
                            <Quote/>
                        </>
                        : null}
                    {value == 2 ? <>
                            <Material/>
                        </>
                        : null}
                </div>
            </div>
        </>);
}

function Tutor({tutor}: { tutor: any }) {
    const isMobile = useIsMobile();
    const router = useRouter()

    if (tutor === undefined)
        return (<></>);

    return (
        <>
            <SEO title={'Трифоненков В.П.'}
                 thumbnail={`https://daily-mephi.ru/api/v1/tutors/${tutor.id}/thumbnail.png`}/>
            {isMobile == null ? null :
                <>
                    <div className="flex-wrap w-full">
                        <TutorProfile tutor={tutor} loading={router.isFallback}/>
                        <div className="w-full mt-7">
                            <Tabs tutorId={tutor.id}/>
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
        fallback: true, // can also be true or 'blocking'
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
