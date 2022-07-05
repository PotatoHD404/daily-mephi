import Image from "next/image";
import ProfilePicture2 from "images/profile2.png";
import CommentIco from 'images/comment.svg';
import React from "react";

function ProfilePic() {
    return <div className="h-[2.6rem] w-[2.6rem]">
        <Image
            src={ProfilePicture2}
            alt="Profile picture"
            className="rounded-full"
        />
    </div>;
}

type Children =
    React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | string
    | number
    | {}
    | Iterable<React.ReactNode>
    | React.ReactPortal
    | boolean
    | null
    | undefined;

interface Comment1Params {
    nick?: string;
    date?: string;
    body?: string;
    src?: any;
    children?: Children;
    repliesCount?: number;
}

export default function Comment(props: Comment1Params) {
    props.nick = props.nick || "User1";
    props.date = props.date || "15 февраля 2022";
    props.body = props.body || "Comment body";
    props.src = props.src || CommentIco;
    props.repliesCount = props.repliesCount || 1;

    return <div className="text-xl mt-2">
        <div className="flex">
            <ProfilePic/>
            <span className="font-bold ml-2 my-auto">{props.nick}</span>
            <span className="ml-2 my-auto ml-8">{props.date}</span>
        </div>
        <div className="flex mt-1 ml-5">
            <div className="bg-black w-[2px] h-auto"/>
            <div className="w-full flex-wrap ml-5">
                <div className="mb-1">{props.body}</div>
                <div className="text-[1.1rem] font-bold flex">
                    <div className="h-5 w-5 mr-1 my-auto">
                        <Image
                            src={props.src}
                            alt="Reply ico"
                        />
                    </div>
                    <div className="my-auto">Reply</div>
                </div>
                <div>{props.children}</div>

            </div>

        </div>
        {props.repliesCount ?
            <button className="ml-5 text-blue-500 text-[1.1rem] font-semibold">
                {props.repliesCount} more repl{props.repliesCount > 1 ? "ies" : "y"}
            </button>
            : null}
    </div>;
}
