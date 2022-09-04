import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import {a11yProps} from 'helpers/reactUtils'
import Image from "next/image";
import LikeIco from "images/like.svg";
import CommentIco from "images/comment.svg";
import Comment from "components/comment";
import ProfileIco from "images/profile3.png";
import MiniCat from "images/minicat_transparent.svg";
import GoldenCrown from "images/golden_crown.svg";
import SilverCrown from "images/silver_crown.svg";
import BronzeCrown from "images/bronze_crown.svg";
import SEO from "components/seo";
import {LikeComponent} from "components/like";
import {DislikeComponent} from "components/dislike";
import {CommentComponent} from "components/commentComponent";
import {Comments} from "components/comments";

interface CrownParams {
    place: number;
}

interface CrownCompParams {
    src: any;
}

function CrownComp(props: CrownCompParams) {
    return <div className="h-8 my-auto w-8 absolute ml-[2rem] -mt-[0.85rem]">
        <Image
            src={props.src}
            alt="Crown"
            className="rounded-full"
        />
    </div>;
}

function Crown(props: CrownParams) {
    switch (props.place) {
        case 1:
            return (
                <CrownComp src={GoldenCrown}/>
            );
        case 2:
            return (
                <CrownComp src={SilverCrown}/>
            );
        case 3:
            return (
                <CrownComp src={BronzeCrown}/>
            );
        default:
            return null;
    }
}

interface TopUserParams {
    src: any;
    place: number;
    rating: string;
    nickname: string;
}

function TopUser(props: TopUserParams) {
    return <tr>
        <td className="text-center">{props.place}</td>
        <td>
            <div className="flex pl-4 h-[4.5rem]">
                <div className="h-14 my-auto w-14 flex">
                    <Image
                        src={props.src}
                        alt="Profile pic"
                        className="rounded-full"
                    />
                    <Crown place={props.place}/>
                </div>
                <div className="text-[0.8rem] h-fit my-auto ml-2">{props.nickname}</div>
            </div>
        </td>
        <td className="text-center">{props.rating}</td>
    </tr>;
}

function TopUsers() {
    return <div className="w-[23.5] hidden md:block">
        <div className="md:text-[1.4rem] text-xl md:mt-[0.5rem] md:h-[3rem] flex items-center justify-center text-center pb-2">Топ Мифистов</div>
        <div className="w-full h-[1px] bg-black bg-opacity-10 mb-4"/>

        <div
            className="rounded-2xl pt-6 pb-4 px-3.5 text-[1.25rem] ml-auto w-[99.5%] bg-white bg-opacity-90 flex-wrap space-y-5
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
                <TopUser src={ProfileIco} place={1} rating={"3.1К"} nickname={"Burunduk"}/>
                <TopUser src={ProfileIco} place={2} rating={"3.1К"} nickname={"Burunduk"}/>
                <TopUser src={ProfileIco} place={3} rating={"3.1К"} nickname={"Burunduk"}/>
                <TopUser src={ProfileIco} place={4} rating={"3.1К"} nickname={"Burunduk"}/>
                </tbody>
            </table>
        </div>
    </div>;
}

function Post() {
    return <>
        <div className="rounded-2xl p-5 px-4 md:text-[1.7rem] text-xl w-[99.5%] bg-white bg-opacity-90">
            <div className="flex w-full mb-4">
                <div className="h-12 my-auto w-12">
                    <Image
                        src={MiniCat}
                        alt="Mini cat"
                    />
                </div>
                <div className="ml-2 my-auto -mt-1">
                    <div className="font-bold text-[1.0rem]">Daily MEPhi</div>
                    <div className="md:text-lg text-sm my-auto opacity-60">15 февраля 2022</div>
                </div>
            </div>
            <h1 className="font-bold text-[1.1rem] leading-6">Заголовок</h1>
            <div className="mb-2 text-[1.0rem] leading-5">Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Adipisci
                aut autem
                dolores dolorum enim esse excepturi fugit, inventore laboriosam magnam nihil
                officiis possimus qui recusandae repudiandae sed sequi sunt temporibus.
            </div>
            <div className="flex space-x-4 font-semibold mb-2">
                <LikeComponent/>
                <DislikeComponent/>
                <CommentComponent/>
            </div>
            <div className="w-full bg-black mx-auto mb-4 h-[2px]"/>
            <Comments/>
        </div>
    </>;
}


function About() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    return (
        <>
            <SEO title='О нас'/>

            <div className="flex w-full justify-between">
                <div className="md:w-[75%] w-[100%]">
                    <Box sx={{borderBottom: 1, borderColor: 'divider', marginBottom: '1rem'}}>
                        <Tabs value={value} onChange={handleChange} variant="fullWidth"
                              TabIndicatorProps={{style: {background: 'white'},}}>
                            <Tab sx={{ minWidth: "fit-content",  maxWidth: "fit-content", padding: '0.5rem', margin: 'auto' }}
                                label={
                                <div className="flex h-8">
                                    <div
                                        className="text-black md:text-[1.4rem] text-xl font-[Montserrat] normal-case my-auto">О
                                        нас
                                    </div>
                                </div>
                            } {...a11yProps(0)}
                            />
                            <Tab sx={{ minWidth: "fit-content",  maxWidth: "fit-content", padding: '0.5rem', margin: 'auto' }}
                                label={
                                <div className="flex h-8">
                                    <div
                                        className="text-black md:text-[1.4rem] text-xl font-[Montserrat] normal-case my-auto">Новости
                                    </div>
                                </div>
                            } {...a11yProps(1)}
                            />
                            <Tab sx={{ minWidth: "fit-content",  maxWidth: "fit-content", padding: '0.5rem', margin: 'auto' }}
                                label={
                                <div className="flex h-8">
                                    <div
                                        className="text-black md:text-[1.4rem] text-xl font-[Montserrat] normal-case my-auto">Правила
                                    </div>
                                </div>
                            } {...a11yProps(2)}
                            />
                        </Tabs>
                    </Box>
                    {value == 0 ? <Post/> : null}
                    {value == 1 ? <Post/> : null}
                    {value == 2 ? <Post/> : null}
                </div>
                <TopUsers/>
            </div>
        </>);

}

export default About;
