import React from "react";
import Image from "next/image";
import DeadCat from "images/dead_cat.svg";
import {Skeleton} from "@mui/material";
import {UserType} from "lib/database/types";
import Link from "next/link";


export default function UserHeaderComponent(props: { user?: UserType, legacyNickname?: string, date?: Date, isLoading?: boolean }) {
    return <div className="flex w-full mb-3 content-center items-center">
        {props.isLoading ? <Skeleton className="w-14 h-14 my-auto" variant="circular"/> :
            props.user?.id ?
                <Link href={`/users/${props.user.id}`}>
                    <a className="h-14 my-auto w-14">
                        <Image
                            src={props.user?.image.url ?? DeadCat}
                            alt="Profile picture"
                            className="rounded-full"
                            width={512}
                            height={512}
                        />
                    </a>
                </Link> :
                <a className="h-14 my-auto w-14">
                    <Image
                        src={props.user?.image.url ?? DeadCat}
                        alt="Profile picture"
                        className="rounded-full"
                        width={512}
                        height={512}
                    />
                </a>
        }
        {props.isLoading ?
            <div className="ml-2 h-fit">
                <Skeleton className="w-32 h-7 my-auto" variant="rounded"/>
                <Skeleton className="w-32 h-4 mt-2 my-auto" variant="rounded"/>
            </div> :
            props.user?.id ?
                <Link href={`/users/${props.user.id}`}>
                    <a className="ml-2 h-fit">
                        <div className="font-bold text-[0.9rem] leading-5">
                            {props.user?.name ?? props?.legacyNickname ?? "Аноним"}
                        </div>
                        <div className="text-[0.8rem] leading-5 my-auto opacity-60">
                            {typeof props.date}
                        </div>
                    </a></Link> :
                <div className="ml-2 h-fit">
                    <div className="font-bold text-[0.9rem] leading-5">
                        {props.user?.name ?? props?.legacyNickname ?? "Аноним"}
                    </div>
                    <div className="text-[0.8rem] leading-5 my-auto opacity-60">
                        {/*{props.date ?? "Неизвестно"}*/}
                    </div>
                </div>
        }

    </div>;
}
