import Image from "next/image";
import LikeIco from "../images/like.svg";
import React from "react";

export function LikeComponent() {
    return <div className="h-fit flex space-x-2">
        <div className="h-6 my-auto flex w-6">
            <Image
                src={LikeIco}
                alt="Like"
            />
        </div>
        <div className="text-xl mt-0.5">?</div>
    </div>;
}