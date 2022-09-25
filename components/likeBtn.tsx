import Image from "next/image";
import LikeIco from "images/like.svg";
import PressedLikeIco from "images/pressed_like.svg";
import React from "react";
import addPrefixes from "lib/react/addPrefixes";
import {Button} from '@mui/material';


export default function LikeBtn() {
    const prefixes = ['hover:', 'focus:', 'active:', ""];
    // use state liked
    const [liked, setLiked] = React.useState(false);
    return (
        <Button variant="contained"
                className={`flex px-3 rounded-3xl  h-[1.8rem]
                    items-center font-[Montserrat] font-semibold justify-evenly min-w-0
                    ${addPrefixes(prefixes, "shadow-none")}
                    ${liked ? addPrefixes(prefixes, "bg-gradient-to-b from-[#FEB7BC] to-[#F591C7]") :
                    addPrefixes(prefixes, "bg-black bg-opacity-10")} `}
                onClick={() => setLiked(!liked)}
        >
            <div className="h-[1.2rem] w-[1.2rem] flex mr-2">
                <Image
                    src={liked ? PressedLikeIco : LikeIco}
                    alt="Like ico"
                />
            </div>
            <div className="text-[0.9rem]">11</div>
        </Button>
    );
}
