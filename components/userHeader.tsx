import React from "react";
import Image from "next/image";
import DeadCat from "images/dead_cat.svg";
import {Skeleton} from "@mui/material";
import Link from "next/link";
import {DateTime} from "luxon";
import {ReviewType} from "./reviews";

// use luxon to format date as russian
function dateToSocial(date: Date) {
    return DateTime.fromJSDate(date).setLocale("ru").toRelative();
}

export type UserType = ReviewType['user']

type Props = {
    isLoading: true
    date?: never
} | ({
    isLoading?: boolean
    date: Date
} & ({
    user: UserType,
    legacyNickname?: string | null,
} | {
    user?: UserType | null,
    legacyNickname: string | null,
}))

export default function UserHeaderComponent(props: Props) {
    const date = dateToSocial(props.date ?? new Date());
    return (
        <div className="flex w-full mb-3 content-center items-center">
            {props.isLoading ? (
                    <>
                        <Skeleton className="w-14 h-14 my-auto" variant="circular"/>
                        <div className="ml-2 h-fit">
                            <Skeleton className="w-32 h-7 my-auto" variant="rounded"/>
                            <Skeleton className="w-32 h-4 mt-2 my-auto" variant="rounded"/>
                        </div>
                    </>) :
                props.user?.id ?
                    (
                        <>
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
                            </Link>
                            <Link href={`/users/${props.user.id}`} className="ml-2 h-fit" legacyBehavior>
                                <div className="font-bold text-[0.9rem] leading-5">
                                    {props.user?.nickname ?? props?.legacyNickname ?? "Аноним"}
                                </div>
                                <div className="text-[0.8rem] leading-5 my-auto opacity-60">
                                    {date}
                                </div>
                            </Link>
                        </>
                    ) : (
                        <>
                            <div className="h-14 my-auto w-14">
                                <Image
                                    src={props.user?.image?.url ?? DeadCat}
                                    alt="Profile picture"
                                    className="rounded-full"
                                    width={512}
                                    height={512}
                                />
                            </div>
                            <div className="ml-2 h-fit">
                                <div className="font-bold text-[0.9rem] leading-5">
                                    {props.user?.nickname ?? props?.legacyNickname ?? "Аноним"}
                                </div>
                                <div className="text-[0.8rem] leading-5 my-auto opacity-60">
                                    {date}
                                </div>
                            </div>
                        </>)

            }
        </div>
    );
}
