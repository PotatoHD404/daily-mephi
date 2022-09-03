import Image from "next/image";
import LikeIco from "../images/like.svg";
import React from "react";

export function DislikeComponent(props: {up?: boolean}) {
    return <div className="flex space-x-2 h-fit">
        <div className={`h-[1.1rem] w-[1.1rem] my-auto flex mt-${props.up ? "2" : "1.5"}`}>
            <Image
                src={LikeIco}
                alt="Dislike"
                className="rotate-180"
            />
        </div>
        <div className="text-[1.0rem] my-auto">?</div>
    </div>;
}
