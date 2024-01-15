import * as React from "react";
import {ButtonBase} from '@mui/material';


export default function RippledButton(props: {
    onClick: () => Promise<void> | void,
    children: any,
    disabled?: boolean
}) {
    return <ButtonBase onClick={props.onClick}
                       className="rounded-full w-full p-1" disabled={props.disabled}
    >
        {props.children}
    </ButtonBase>;
}
