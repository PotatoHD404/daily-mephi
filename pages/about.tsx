import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import {a11yProps} from '../lib/frontend/utils'
import Image from "next/image";
import LikeIco from "../images/like.svg";
import CommentIco from "../images/comment.svg";
import Comment from "../components/comment";
import ProfileIco from "../images/profile3.png";
import ProfilePicture2 from "../images/profile2.png";

function About() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };


    return (
        <div className="flex w-full justify-between">
            <div className="w-[75%]">
                <Box sx={{borderBottom: 1, borderColor: 'divider', marginBottom: '1rem'}}>
                    <Tabs value={value} onChange={handleChange} variant="fullWidth"
                          TabIndicatorProps={{style: {background: 'white'}}}>
                        <Tab label={
                            <div className="flex h-8  w-[11.5rem]">
                                {/*<div className="flex h-10 my-auto">*/}
                                {/*    <Image*/}
                                {/*        src={reviewsIco}*/}
                                {/*        alt="Reviews ico"*/}
                                {/*    />*/}
                                {/*</div>*/}
                                <div className="text-black text-[1.7rem] font-[Montserrat] normal-case my-auto">О нас
                                </div>
                            </div>
                        } {...a11yProps(0)}
                        />
                        <Tab label={
                            <div className="flex h-8  w-[11rem]">
                                {/*<div className="flex h-10 my-auto">*/}
                                {/*    <Image*/}
                                {/*        src={quotesIco}*/}
                                {/*        alt="Quotes ico"*/}
                                {/*    />*/}
                                {/*</div>*/}
                                <div className="text-black text-[1.7rem] font-[Montserrat] normal-case my-auto">Новости
                                </div>
                            </div>
                        } {...a11yProps(1)}
                        />
                        <Tab label={
                            <div className="flex h-8 w-[14.5rem]">
                                {/*<div className="flex h-10 my-auto">*/}
                                {/*    <Image*/}
                                {/*        src={materialsIco}*/}
                                {/*        alt="Materials ico"*/}
                                {/*    />*/}
                                {/*</div>*/}
                                <div
                                    className="text-black text-[1.7rem] font-[Montserrat] normal-case my-auto">Правила
                                </div>
                            </div>
                        } {...a11yProps(2)}
                        />
                    </Tabs>
                </Box>
                {value == 0 ?
                    <>
                        <div className="rounded-2xl p-6 text-[1.7rem] w-full bg-white bg-opacity-90">
                            <div className="flex w-full mb-4">
                                <div className="h-14 my-auto w-14">
                                    <Image
                                        src={ProfilePicture2}
                                        alt="Mini cat"
                                        className="rounded-full"
                                    />
                                </div>
                                <span className="font-bold ml-2 my-auto">User1</span>
                                <span className="ml-2 my-auto ml-8">15 февраля 2022</span>
                            </div>
                            <div className="font-bold">Заголовок</div>
                            <div className="mb-4">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci
                                aut autem
                                dolores dolorum enim esse excepturi fugit, inventore laboriosam magnam nihil
                                officiis possimus qui recusandae repudiandae sed sequi sunt temporibus.
                            </div>
                            <div className="flex space-x-4 font-semibold mb-4">
                                <div className="h-fit flex space-x-2">
                                    <div className="h-6 my-auto flex w-6">
                                        <Image
                                            src={LikeIco}
                                            alt="Like"
                                        />
                                    </div>
                                    <div className="text-xl mt-0.5">?</div>
                                </div>
                                <div className="flex space-x-2 h-fit">
                                    <div className="h-6 my-auto flex w-6 mt-2">
                                        <Image
                                            src={LikeIco}
                                            alt="Dislike"
                                            className="rotate-180"
                                        />
                                    </div>
                                    <div className="text-xl my-auto">?</div>
                                </div>
                                <div className="flex space-x-2">
                                    <div className="h-6 my-auto flex w-6  mt-2">
                                        <Image
                                            src={CommentIco}
                                            alt="Comment"
                                        />
                                    </div>
                                    <div className="text-xl my-auto">?</div>
                                </div>
                            </div>
                            <div className="w-full bg-black mx-auto mb-4 h-[2px]"/>
                            <div className="flex-wrap space-y-5">
                                <Comment><Comment/></Comment>
                                <Comment/>
                            </div>
                        </div>
                    </> : null}
            </div>
            <div className="w-[23.5%]">
                <div className="text-[1.7rem] mt-[0.5rem] h-[3rem] text-center">Топ Мифистов</div>
                <div className="w-full h-[1px] bg-black bg-opacity-10 mb-4"/>
                <div className="rounded-2xl py-6 px-3.5 text-[1.25rem] w-full bg-white bg-opacity-90 flex-wrap space-y-5">
                    <div className="flex">
                        <div className="mr-4 -ml-0.5">#</div>
                        <div>Имя</div>
                        <div className="ml-auto">Рейтинг</div>
                    </div>
                    <div className="flex">
                        <div className="mr-3.5 my-auto">1</div>
                        <div className="flex w-[190%]">
                            <div className="h-14 my-auto w-14">
                                <Image
                                    src={ProfileIco}
                                    alt="Profile pic"
                                    className="rounded-full"
                                />
                            </div>
                            <div className="text-[0.8rem] h-fit my-auto ml-2">Burunduk</div>
                        </div>

                        <div className="ml-auto w-full text-center h-fit my-auto">3.1 K</div>
                    </div>
                    <div className="flex">
                        <div className="mr-3.5 my-auto">2</div>
                        <div className="flex w-[190%]">
                            <div className="h-14 my-auto w-14">
                                <Image
                                    src={ProfileIco}
                                    alt="Profile pic"
                                    className="rounded-full"
                                />
                            </div>
                            <div className="text-[0.8rem] h-fit my-auto ml-2">Burunduk</div>
                        </div>

                        <div className="ml-auto w-full text-center h-fit my-auto">3.1 K</div>
                    </div>
                    <div className="flex">
                        <div className="mr-3.5 my-auto">3</div>
                        <div className="flex w-[190%]">
                            <div className="h-14 my-auto w-14">
                                <Image
                                    src={ProfileIco}
                                    alt="Profile pic"
                                    className="rounded-full"
                                />
                            </div>
                            <div className="text-[0.8rem] h-fit my-auto ml-2">Burunduk</div>
                        </div>

                        <div className="ml-auto w-full text-center h-fit my-auto">3.1 K</div>
                    </div>
                </div>
            </div>
        </div>);

}

export default About;
