import ProfileIco from "../images/profile3.png";
import React from "react";
import Image from "next/image";
import GoldenCrown from "../images/golden_crown.svg";
import SilverCrown from "../images/silver_crown.svg";
import BronzeCrown from "../images/bronze_crown.svg";


export interface TopUserParams {
    src: any;
    place: number;
    rating: string;
    nickname: string;
}

export interface CrownParams {
    place: number;
}

export interface CrownCompParams {
    src: any;
}

export function CrownComp(props: CrownCompParams) {
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

export default function TopUsers(props: { withLabel?: boolean }) {
    return <div className="w-[23.5] hidden md:block -mt-2">
        {
            props.withLabel ? (<>
                <div
                    className="md:text-[1.4rem] text-xl md:mt-[0.5rem] md:h-[3rem] flex items-center justify-center text-center pb-2">Топ
                    Мифистов
                </div>
                <div className="w-full h-[1px] bg-black bg-opacity-10 mb-4"/>
            </>) : null

        }
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
