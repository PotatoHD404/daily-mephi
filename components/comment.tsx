import Image from "next/image";
import ProfilePicture2 from "../images/profile2.png";
import CommentIco from '../images/comment.svg';
import React from "react";

interface MyProps {
}

export default function Comment({children}: React.PropsWithChildren<MyProps>) {


    return (
        <div className="text-xl mt-2">
            <div className="flex">
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
                <div className="bg-black w-[2px] h-auto"/>
                <div className="w-full flex-wrap ml-5">
                    <div className="mb-1">Comment body</div>
                    <div className="text-[1.1rem] font-bold flex">
                        <div className="h-5 w-5 mr-1 my-auto">
                            <Image
                                src={CommentIco}
                                alt="Reply ico"
                            />
                        </div>
                        <div className="my-auto">Reply</div>
                    </div>
                    <div>{children}</div>

                </div>

            </div>
            <div className="ml-5 text-blue-500 text-[1.1rem] font-semibold">1 more reply</div>
        </div>
    );
}