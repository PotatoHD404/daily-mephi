import React from "react";
import Image from "next/image";
import ProfilePicture2 from 'images/profile2.png';


export default function UserHeaderComponent(props: { name: string, date: string, isLoading?: boolean }) {
    return <div className="flex w-full mb-3 content-center items-center">
        <div className="h-14 my-auto w-14">
            <Image
                src={ProfilePicture2}
                alt="Profile picture"
                className="rounded-full"
            />
        </div>
        <div className="ml-2 h-fit">
            <div className="font-bold text-[0.9rem] leading-5">{props.name}</div>
            <div className="text-[0.8rem] leading-5 my-auto opacity-60">{props.date}</div>
        </div>

    </div>;
}
