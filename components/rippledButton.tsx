import ButtonBase from "@mui/material/ButtonBase";
import * as React from "react";

export default function RippledButton(props: { onClick: () => Promise<void> | void, text: string }) {
    return <ButtonBase onClick={props.onClick}
                   className="rounded-full w-full p-1">
        {props.text}
    </ButtonBase>;
}
