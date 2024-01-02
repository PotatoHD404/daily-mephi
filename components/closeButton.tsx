import Image from "next/image";
import CloseIcon from "../images/close_icon.svg";
import {IconButton} from '@mui/material';

export default function CloseButton(props: { onClick: () => void, hidden?: boolean }) {
    return <IconButton
        aria-label="close"
        onClick={props.onClick}
        className={`w-[2.5rem] h-[2.5rem] top-3 absolute right-3 ${props.hidden ? "hidden" : ""}`}
    >
        <Image
            src={CloseIcon}
            alt="Close icon"
            className="scale-90"
        />
    </IconButton>;
}
