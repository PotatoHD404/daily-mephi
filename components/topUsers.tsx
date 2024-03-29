import DeadCat from "images/dead_cat.svg";
import React from "react";
import Image from "next/image";
import GoldenCrown from "images/golden_crown.svg";
import SilverCrown from "images/silver_crown.svg";
import BronzeCrown from "images/bronze_crown.svg";
import Link from "next/link";
import {Skeleton} from "@mui/material";
import {trpc} from "server/utils/trpc";


const formatter = Intl.NumberFormat('en', {notation: "compact"});


export interface TopUserParams {
    src: any;
    place: number;
    rating: number;
    nickname: string;
    id?: string;
    isLoading?: boolean;
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

export function Crown(props: CrownParams) {
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

function TopUserContent(props: TopUserParams) {
    return (
        <tr>
            <td className="text-center"><Link href={`/users/${props.id || ""}`}
            >{props.place.toString()}</Link></td>
            <td>
                <Link
                    href={`/users/${props.id || ""}`}
                    className="flex pl-4 h-[4.5rem]"
                >
                    <>
                        <div className="h-14 my-auto w-14 flex">
                            <Image
                                src={props.src}
                                alt="Profile pic"
                                className="rounded-full"
                                height={400}
                                width={400}
                            />
                            <Crown place={props.place}/>
                        </div>
                        <div className="text-[0.8rem] h-fit my-auto ml-2 font-bold">{props.nickname}</div>
                    </>
                </Link>
            </td>
            <td className="text-center">{formatter.format(props.rating)}</td>
        </tr>
    );
}

function TopUserContentLoading() {
    return (
        <tr>
            <td className="text-center"><Skeleton variant="rounded" width={40} height={20} className="mx-auto"/></td>
            <td>
                <div className="flex pl-4 h-[4.5rem]">
                    <Skeleton className="h-14 my-auto w-14 flex" variant="circular"/>
                    <Skeleton className="my-auto ml-2" variant="rounded" width={60} height={20}/>
                </div>
            </td>
            <td className="text-center"><Skeleton className="mx-auto" variant="rounded" width={60} height={20}/></td>
        </tr>
    )
}

export default function TopUsers(props: { withLabel?: boolean, place?: number, isLoading?: boolean, take?: number }) {

    // const isUUID = props.id && typeof props.id === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(props.id)
    // const {status} = useSession();
    // const queryParams = {skip: props.skip, take: props.take};
    // @ts-ignore
    // Object.keys(queryParams).forEach(key => queryParams[key] === undefined ? delete queryParams[key] : {});
    // const params: Record<string, string> = {place: place.toString()};
    // if (props.take) {
    //     params["take"] = props.take.toString();
    // }


    const {data, isFetching, refetch, isError, error} =
        trpc.utils.top.useQuery({place: props.place, take: props.take}, {
            enabled: !props.isLoading
        });

    const isLoading = isFetching || (props.isLoading ?? false);
    // const isLoading = true;
    // const router = useRouter();
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

            <table className={`table-auto ${isLoading ? "w-[252px]" : "w-full"}`}>
                <thead>
                <tr>
                    <th className="font-medium">{
                        isLoading ? <Skeleton className="mx-auto" variant="rounded" width={40} height={20}/> :
                            "#"}
                    </th>
                    <th className={`text-left ${isLoading ? "" : "pl-4"} font-medium`}>{
                        isLoading ? <Skeleton className="mx-auto" variant="rounded" width={100} height={20}/> :
                            "Имя"}
                    </th>
                    <th className="font-medium">{
                        isLoading ? <Skeleton className="mx-auto" variant="rounded" width={68} height={20}/> :
                            "Рейтинг"}</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                {
                    isLoading ? [...Array(props.take ?? 4).keys()].map((_, index) =>
                            <TopUserContentLoading key={index}/>) :
                        data?.map((user, index) => {
                            return <TopUserContent src={user.image || DeadCat} key={index}
                                                   nickname={user?.nickname ?? "Unknown"}
                                                   place={user.place} id={user.id}
                                                   rating={user.rating}/>
                        })
                }
                </tbody>
            </table>
        </div>
    </div>;
}
