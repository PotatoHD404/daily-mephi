import ButtonBase from "@mui/material/ButtonBase";
import * as React from "react";

export default function RippledButton(props: { onClick: () => Promise<void> | void, children: any }) {
    return <ButtonBase onClick={props.onClick}
                   className="rounded-full w-full p-1">
        {props.children}
    </ButtonBase>;
}
