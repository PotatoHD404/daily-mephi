import Image from "next/image";
import ProfilePicture2 from "images/profile2.png";
import React from "react";
import LikeBtn from "./likeBtn";
import DislikeBtn from "./dislikeBtn";
import ReplyBtn from "./replyBtn";

function ProfilePic(props: { src: any }) {
    return <div className="h-[2.6rem] w-[2.6rem]">
        <Image
            src={props.src}
            alt="Profile picture"
            className="rounded-full"
        />
    </div>;
}

type Children =
    React.ReactElement<any, string | React.JSXElementConstructor<any>>;

interface CommentParams {
    nick?: string;
    date?: string;
    body?: string;
    src?: any;
    children?: Children;
    repliesCount?: number;
}

export default function Comment({
                                    nick = "User1",
                                    date = "15 февраля 2022",
                                    body = "Comment body",
                                    src = ProfilePicture2,
                                    repliesCount = 1,
                                    children
                                }: CommentParams) {


    return <div className="text-xl mt-2 leading-5">
        <div className="flex">
            <ProfilePic src={src}/>
            <div className="ml-2 my-auto -mt-1">
                <div className="font-bold text-[0.9rem]">{nick}</div>
                <div className="text-sm my-auto opacity-60">{date}</div>
            </div>
        </div>
        <div className="flex mt-1 ml-5">
            <div className="bg-black w-[2px] h-auto"/>
            <div className="w-full flex-wrap ml-5 text-[0.95rem]">
                <div className="mb-1 ml-1">{body}</div>
                <div className="md:text-[1.1rem] text-[1rem] font-bold mb-3">
                    {/*<div className="h-5 w-5 mr-1 my-auto">*/}
                    {/*    <Image*/}
                    {/*        src={src}*/}
                    {/*        alt="Reply ico"*/}
                    {/*    />*/}
                    {/*</div>*/}
                    {/*<div className="my-auto">Reply</div>*/}
                    <div className="flex space-x-2 font-semibold my-2">
                        <LikeBtn/>
                        <DislikeBtn/>
                        <ReplyBtn/>
                    </div>
                </div>
                <div>{children}</div>

            </div>

        </div>
        {repliesCount ?
            <button className="ml-5 text-blue-500 text-[0.9rem] font-semibold">
                {`${repliesCount} more repl${repliesCount > 1 ? "ies" : "y"}`}
            </button>
            : null}
    </div>;
}
