import Comment from "./comment";
import React from "react";

export function Comments() {
    return <div className="flex-wrap space-y-5">
        <Comment><Comment/></Comment>
        <Comment/>
    </div>;
}