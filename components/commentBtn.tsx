import Image from "next/image";
import CommentIco from "images/comment.svg";
import React from "react";
import {Button} from '@mui/material';

export default function CommentBtn({count}: { count: number }) {
    return (
        <Button variant="contained"
                className="flex px-3 shadow-none focus:shadow-none focus:bg-black focus:bg-opacity-10 active:shadow-none active:bg-black active:bg-opacity-10 rounded-3xl bg-black bg-opacity-10 h-[1.8rem]
                    items-center font-[Montserrat] font-semibold justify-evenly min-w-0"
        >
            <div className="h-[1.2rem] w-[1.3rem] flex mr-2">
                <Image
                    src={CommentIco}
                    alt="Comment"
                />
            </div>
            <div className="text-[0.9rem]">{count}</div>
        </Button>);
}
