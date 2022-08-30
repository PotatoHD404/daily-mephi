import Image from "next/image";
import CommentIco from "../images/comment.svg";
import React from "react";

export function CommentComponent() {
    return <div className="flex space-x-2">
        <div className="h-6 my-auto flex w-6  mt-2">
            <Image
                src={CommentIco}
                alt="Comment"
            />
        </div>
        <div className="text-xl my-auto">?</div>
    </div>;
}