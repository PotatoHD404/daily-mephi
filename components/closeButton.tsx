import Image from "next/future/image";
import CloseIcon from "../images/close_icon.svg";
import * as React from "react";
import { IconButton } from '@mui/material';

export default function CloseButton(props: { onClick: () => void }) {
    return <IconButton
        aria-label="close"
        onClick={props.onClick}
        className="w-[2.5rem] h-[2.5rem] top-3 absolute right-3"
    >
        <Image
            src={CloseIcon}
            alt="Close icon"
            className="scale-90"
        />
    </IconButton>;
}
