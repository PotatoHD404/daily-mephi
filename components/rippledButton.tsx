import * as React from "react";
import {ButtonBase} from '@mui/material';


export default function RippledButton(props: {
    onClick: () => Promise<any> | any,
    children: any,
    disabled?: boolean,
    className?: string,
    style?: React.CSSProperties
}) {
    return <ButtonBase onClick={props.onClick}
                       className={props.className ?? "rounded-full w-full p-1 shadow-sm"} disabled={props.disabled}
                       style={props.style}
    >
        {props.children}
    </ButtonBase>;
}
