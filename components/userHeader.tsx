import React from "react";
import Image from "next/image";
import DeadCat from "images/dead_cat.svg";
import {Skeleton} from "@mui/material";
import Link from "next/link";
import {DateTime} from "luxon";
import {RouterOutputs} from "server/utils/trpc";
import {ReviewType} from "./reviews";

// use luxon to format date as russian
function dateToSocial(date: Date) {
    return DateTime.fromJSDate(date).setLocale("ru").toRelative();
}

export type UserType = ReviewType['user']

export default function UserHeaderComponent(props: {
    user?: UserType,
    legacyNickname: string | null,
    date: Date,
    isLoading?: boolean
}) {
    const date = dateToSocial(props.date);
    return (
        <div className="flex w-full mb-3 content-center items-center">
            {props.isLoading ? <Skeleton className="w-14 h-14 my-auto" variant="circular"/> :
                props.user?.id ?
                    <Link
                        href={`/users/${props.user.id}`}
                        className="h-14 my-auto w-14"
                        legacyBehavior>
                        <Image
                            src={props.user?.image?.url ?? DeadCat}
                            alt="Profile picture"
                            className="rounded-full"
                            width={512}
                            height={512}
                        />
                    </Link> :
                    <div className="h-14 my-auto w-14">
                        <Image
                            src={props.user?.image?.url ?? DeadCat}
                            alt="Profile picture"
                            className="rounded-full"
                            width={512}
                            height={512}
                        />
                    </div>
            }
            {props.isLoading ?
                <div className="ml-2 h-fit">
                    <Skeleton className="w-32 h-7 my-auto" variant="rounded"/>
                    <Skeleton className="w-32 h-4 mt-2 my-auto" variant="rounded"/>
                </div> :
                props.user?.id ?
                    <Link href={`/users/${props.user.id}`} className="ml-2 h-fit" legacyBehavior>
                        <div className="font-bold text-[0.9rem] leading-5">
                            {props.user?.nickname ?? props?.legacyNickname ?? "Аноним"}
                        </div>
                        <div className="text-[0.8rem] leading-5 my-auto opacity-60">
                            {date}
                        </div>
                    </Link> :
                    <div className="ml-2 h-fit">
                        <div className="font-bold text-[0.9rem] leading-5">
                            {props.user?.nickname ?? props?.legacyNickname ?? "Аноним"}
                        </div>
                        <div className="text-[0.8rem] leading-5 my-auto opacity-60">
                            {date}
                        </div>
                    </div>
            }

        </div>
    );
}
