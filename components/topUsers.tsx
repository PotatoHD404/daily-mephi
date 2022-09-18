import ProfileIco from "../images/profile3.png";
import React, { useEffect } from "react";
import Image from "next/image";
import GoldenCrown from "../images/golden_crown.svg";
import SilverCrown from "../images/silver_crown.svg";
import BronzeCrown from "../images/bronze_crown.svg";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Skeleton } from "@mui/material";

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
function TopUserContent(props: TopUserParams)
{
    return (<tr>
    <td className="text-center">{props.isLoading ? <Skeleton variant="rounded" width={20} height={20} className="mx-auto"/> : props.place.toString()}</td>
    <td>
        
        <div className="flex pl-4 h-[4.5rem]">
            {
            props.isLoading ? <Skeleton className="h-14 my-auto w-14 flex" variant="circular" /> :
            <div className="h-14 my-auto w-14 flex">
                <Image
                    src={props.src}
                    alt="Profile pic"
                    className="rounded-full"
                />
                <Crown place={props.place}/>
            </div>
            }
            {
                props.isLoading ? <Skeleton className="my-auto ml-2" variant="rounded" width={60} height={20}/>  :
            <div className="text-[0.8rem] h-fit my-auto ml-2">{props.nickname}</div>
            }
        </div>
    </td>
    <td className="text-center">{props.isLoading ?
     <Skeleton className="mx-auto" variant="rounded" width={60} height={20}/> :
      formatter.format(props.rating)}</td>
</tr>)
}
function TopUser(props: TopUserParams) {
    return props.isLoading ? 
    <TopUserContent {...props}/>
    : <Link href={`/users/${props.id || ""}`}>
        <TopUserContent {...props}/>
    </Link>;
}

export default function TopUsers(props: { withLabel?: boolean, place?: number, loading?: boolean }) {
    const place = props.place || 0;
    // const isUUID = props.id && typeof props.id === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(props.id)
    // const {status} = useSession();
    // const queryParams = {skip: props.skip, take: props.take};
    // @ts-ignore
    // Object.keys(queryParams).forEach(key => queryParams[key] === undefined ? delete queryParams[key] : {});
    
    async function getUser() {
        return await (await fetch(`/api/v1/top?${new URLSearchParams({place: place.toString()})}`, {
            method: 'GET',
            credentials: 'same-origin'
        }))?.json();
    }
    const {data, isFetching, refetch, isError, error} = useQuery([`top`], getUser, {
        cacheTime: 0,
        refetchOnWindowFocus: false,
        enabled: false  // disable this query from automatically running
    });
    const isLoading = isFetching || props.loading;
    const router = useRouter();
    useEffect(() => {
        if(!props.loading)
            refetch();
    }, [router.pathname, props.loading])
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
                <TopUser src={ProfileIco} place={1} rating={3100} nickname={"Burunduk"} id={"uuid"} isLoading={isLoading}/>
                <TopUser src={ProfileIco} place={2} rating={3100} nickname={"Burunduk"} isLoading={isLoading}/>
                <TopUser src={ProfileIco} place={3} rating={3100} nickname={"Burunduk"} isLoading={isLoading}/>
                <TopUser src={ProfileIco} place={4} rating={3100} nickname={"Burunduk"} isLoading={isLoading}/>
                </tbody>
            </table>
        </div>
    </div>;
}
