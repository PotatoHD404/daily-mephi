import Image from "next/image";
import LikeIco from "../images/like.svg";
import React from "react";
import Button from "@mui/material/Button";

export function LikeComponent() {
    return (
            <Button variant="contained"
                    className="flex px-3 shadow-none focus:shadow-none focus:bg-black focus:bg-opacity-10 active:shadow-none active:bg-black active:bg-opacity-10 rounded-3xl bg-black bg-opacity-10 h-[1.8rem]
                    items-center font-[Montserrat] font-semibold justify-evenly min-w-0"
            >
                <div className="h-[1.2rem] w-[1.2rem] flex mr-2">
                    <Image
                        src={LikeIco}
                        alt="Comment"
                    />
                </div>
                <div className="text-[0.9rem]">11</div>
            </Button>
    );
}
