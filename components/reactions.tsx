import Like from "./likeBtn";
import Dislike from "./dislikeBtn";
import Comment from "./commentBtn";
import {Skeleton} from "@mui/material";
import React from "react";

export default function Reactions(props: { isLoading?: boolean }) {
    return (
        props.isLoading ?
            <Skeleton className="w-32 h-6 my-auto" variant="rounded"/> :
            <div className="flex space-x-2 font-semibold mb-2">
                <Like/>
                <Dislike/>
                <Comment/>
            </div>);
}
