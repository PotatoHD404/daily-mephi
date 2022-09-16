import * as React from "react";
import { ButtonBase } from '@mui/material';
import {toChildArray} from "preact";

export default function RippledButton(props: { onClick: () => Promise<void> | void, children: any }) {
    return <ButtonBase onClick={props.onClick}
                   className="rounded-full w-full p-1">
        {/* @ts-ignore */}
        {toChildArray(props.children)}
    </ButtonBase>;
}
