import Image from "next/image";
import LikeIco from "../images/like.svg";
import React from "react";

export function LikeComponent() {
    return <div className="h-fit flex space-x-2">
        <div className="h-[1.1rem] w-[1.1rem] my-auto flex">
            <Image
                src={LikeIco}
                alt="Like"
            />
        </div>
        <div className="text-[1.0rem] mt-0.5">?</div>
    </div>;
}
