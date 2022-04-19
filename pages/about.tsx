import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import {a11yProps} from '../helpers/utils'
import Image from "next/image";
import LikeIco from "../images/like.svg";
import CommentIco from "../images/comment.svg";
import Comment from "../components/comment";
import ProfileIco from "../images/profile3.png";
import MiniCat from "../images/minicat_transparent.svg";
import GoldenCrown from "../images/golden_crown.svg";
import SilverCrown from "../images/silver_crown.svg";
import BronzeCrown from "../images/bronze_crown.svg";
import SEO from "../components/seo";


function About() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };


    return (
        <>
            <SEO title='О нас'/>

            <div className="flex w-full justify-between">
                <div className="w-[75%]">
                    <Box sx={{borderBottom: 1, borderColor: 'divider', marginBottom: '1rem'}}>
                        <Tabs value={value} onChange={handleChange} variant="fullWidth"
                              TabIndicatorProps={{style: {background: 'white'}}}>
                            <Tab label={
                                <div className="flex h-8 w-[11.5rem]">
                                    {/*<div className="flex h-10 my-auto">*/}
                                    {/*    <Image*/}
                                    {/*        src={reviewsIco}*/}
                                    {/*        alt="Reviews ico"*/}
                                    {/*    />*/}
                                    {/*</div>*/}
                                    <div className="text-black text-[1.7rem] font-[Montserrat] normal-case my-auto">О
                                        нас
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
                                    <div
                                        className="text-black text-[1.7rem] font-[Montserrat] normal-case my-auto">Новости
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
                                    <div className="h-16 my-auto w-16">
                                        <Image
                                            src={MiniCat}
                                            alt="Mini cat"
                                        />
                                    </div>
                                    <div className="ml-4 my-auto">
                                        <div>Daily MEPhi</div>
                                        <div className="text-lg my-auto opacity-60">15 февраля 2022</div>
                                    </div>
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

                    <div
                        className="rounded-2xl pt-6 pb-4 px-3.5 text-[1.25rem] w-full bg-white bg-opacity-90 flex-wrap space-y-5
                    text-[#5B5959]">

                        <table className="table-auto w-full">
                            <thead>
                            <tr>
                                <th className="font-medium">#</th>
                                <th className="text-left pl-4 font-medium">Имя</th>
                                <th className="font-medium">Рейтинг</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            <tr>
                                <td className="text-center">1</td>
                                <td>
                                    <div className="flex pl-4 h-[4.5rem]">
                                        <div className="h-14 my-auto w-14 flex">
                                            <Image
                                                src={ProfileIco}
                                                alt="Profile pic"
                                                className="rounded-full"
                                            />
                                            <div className="h-8 my-auto w-8 absolute ml-[2rem] -mt-[0.85rem]">
                                                <Image
                                                    src={GoldenCrown}
                                                    alt="Golden crown"
                                                    className="rounded-full"
                                                />
                                            </div>
                                        </div>
                                        <div className="text-[0.8rem] h-fit my-auto ml-2">Burunduk</div>
                                    </div>
                                </td>
                                <td className="text-center">3.1 K</td>
                            </tr>
                            <tr>
                                <td className="text-center">2</td>
                                <td>
                                    <div className="flex pl-4 h-[4.5rem]">
                                        <div className="h-14 my-auto w-14 flex">
                                            <Image
                                                src={ProfileIco}
                                                alt="Profile pic"
                                                className="rounded-full"
                                            />
                                            <div className="h-8 my-auto w-8 absolute ml-[2rem] -mt-[0.85rem]">
                                                <Image
                                                    src={SilverCrown}
                                                    alt="Golden crown"
                                                    className="rounded-full"
                                                />
                                            </div>
                                        </div>
                                        <div className="text-[0.8rem] h-fit my-auto ml-2">Burunduk</div>
                                    </div>
                                </td>
                                <td className="text-center">3.1 K</td>
                            </tr>
                            <tr>
                                <td className="text-center">3</td>
                                <td>
                                    <div className="flex pl-4 h-[4.5rem]">
                                        <div className="h-14 my-auto w-14 flex">
                                            <Image
                                                src={ProfileIco}
                                                alt="Profile pic"
                                                className="rounded-full"
                                            />
                                            <div className="h-8 my-auto w-8 absolute ml-[2rem] -mt-[0.85rem]">
                                                <Image
                                                    src={BronzeCrown}
                                                    alt="Golden crown"
                                                    className="rounded-full"
                                                />
                                            </div>
                                        </div>
                                        <div className="text-[0.8rem] h-fit my-auto ml-2">Burunduk</div>
                                    </div>
                                </td>
                                <td className="text-center">3.1 K</td>
                            </tr>
                            <tr>
                                <td className="text-center">4</td>
                                <td>
                                    <div className="flex pl-4 h-[4.5rem]">
                                        <div className="h-14 my-auto w-14 flex">
                                            <Image
                                                src={ProfileIco}
                                                alt="Profile pic"
                                                className="rounded-full"
                                            />
                                        </div>
                                        <div className="text-[0.8rem] h-fit my-auto ml-2">Burunduk</div>
                                    </div>
                                </td>
                                <td className="text-center">3.1 K</td>
                            </tr>

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>);

}

export default About;
