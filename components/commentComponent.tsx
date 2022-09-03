import Image from "next/image";
import CommentIco from "../images/comment.svg";
import React from "react";

export function CommentComponent(props: {up?: boolean}) {
    return <div className="flex space-x-1">
        <div className={`h-[1.1rem] w-[1.1rem] my-auto flex mt-${props.up ? "2" : "1.5"}`}>
            <Image
                src={CommentIco}
                alt="Comment"
            />
        </div>
        <div className="text-[1.0rem] my-auto">?</div>
    </div>;
}
