import UserHeader from "./userHeader";
import {Skeleton} from "@mui/material";
import Reactions from "./reactions";
import React from "react";

export default function LoadingBlock() {
    return (<div className="text-[1.7rem] w-full whiteBox">
        <UserHeader date={new Date()}
                    isLoading={true}/>
        <Skeleton className="w-full h-6 mt-2" variant="rounded"/>
        <Skeleton className="w-full h-6 mt-2" variant="rounded"/>
        <Skeleton className="w-full h-6 mt-2 mb-2" variant="rounded"/>
        <Reactions isLoading={true}/>
    </div>);
}