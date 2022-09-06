import Button from "@mui/material/Button";
import * as React from "react";

export default function OutlinedButton(props: { onClick: () => Promise<void> | void, text: string }) {
    return <Button onClick={props.onClick}
                   className="rounded-full text-black
                                    font-[Montserrat] font-bold text-center w-full lg:text-3xl md:text-2xl text-xl normal-case">
        {props.text}
    </Button>;
}
