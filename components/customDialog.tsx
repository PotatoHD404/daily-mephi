import Dialog from "@mui/material/Dialog";
import * as React from "react";

export default function CustomDialog(props: { onClose?: () => void, open: boolean, children: any }) {
    return <Dialog
        onClose={props.onClose}
        aria-labelledby="customized-dialog-title"
        open={props.open}
        classes={{
            root: "p-4",
            paper: "bg-white md:w-[60rem] lg:h-[41rem] md:h-[35rem] h-fit py-8 md:py-0 max-w-[100vw] md:max-w-[60rem] m-0 rounded-2xl w-[95vw] overflow-hidden"
        }}
        fullWidth
    >
        {props.children}
    </Dialog>;
}
