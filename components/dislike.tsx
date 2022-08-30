import Image from "next/image";
import LikeIco from "../images/like.svg";
import React from "react";

export function DislikeComponent() {
    return <div className="flex space-x-2 h-fit">
        <div className="h-6 my-auto flex w-6 mt-2">
            <Image
                src={LikeIco}
                alt="Dislike"
                className="rotate-180"
            />
        </div>
        <div className="text-xl my-auto">?</div>
    </div>;
}