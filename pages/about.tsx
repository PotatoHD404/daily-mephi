import React from "react";
import Image from "next/image";
import ProfileIco from "images/profile3.png";
import MiniCat from "images/minicat_transparent.svg";
import GoldenCrown from "images/golden_crown.svg";
import SilverCrown from "images/silver_crown.svg";
import BronzeCrown from "images/bronze_crown.svg";
import SEO from "components/seo";
import Comments from "components/comments";
import TabsBox from "components/tabsBox";
import Reactions from "components/reactions";

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
    return <div className="w-[23.5] hidden md:block -mt-2">
        <div
            className="md:text-[1.4rem] text-xl md:mt-[0.5rem] md:h-[3rem] flex items-center justify-center text-center pb-2">Топ
            Мифистов
        </div>
        <div className="w-full h-[1px] bg-black bg-opacity-10 mb-4"/>

        <div
            className="text-[1.25rem] ml-auto w-[99.5%] whiteBox flex-wrap space-y-5
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
        <div className="whiteBox md:text-[1.7rem] text-xl w-[99.5%]">
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
            <Reactions/>
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
                    <TabsBox value={value} onChange={handleChange} tabs={["О нас", "Новости", "Правила"]}/>
                    {value == 0 ? <Post/> : null}
                    {value == 1 ? <Post/> : null}
                    {value == 2 ? <Post/> : null}
                </div>
                <TopUsers/>
            </div>
        </>);

}

export default About;
