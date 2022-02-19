import Image from "next/image";
import ProfilePicture2 from "../images/profile2.png";
import Divider from "@mui/material/Divider";
import React from "react";

interface MyProps {
}

export default function Comment({children}: React.PropsWithChildren<MyProps>) {


    return (
        <div className="text-xl">
            <div className="flex-row">
                <div className="h-[2.6rem] w-[2.6rem]">
                    <Image
                        src={ProfilePicture2}
                        alt="Profile picture"
                        className="rounded-full"
                    />
                </div>
                <span className="font-bold ml-2 my-auto">User1</span>
                <span className="ml-2 my-auto ml-8">15 февраля 2022</span>
            </div>
            <div className="flex mt-1 ml-5">
                <Divider className="bg-black w-[2px] h-auto" orientation="vertical"/>
                <div className="w-full flex-wrap ml-5">
                    <div className="mb-1">Comment body</div>
                    <div>{children}</div>
                </div>
            </div>
        </div>
    );
}