import Like from "./likeBtn";
import Dislike from "./dislikeBtn";
import Comment from "./commentBtn";
import {Skeleton} from "@mui/material";
import React from "react";
import { setConfig } from "next/config";

export default function Reactions(props: { isLoading?: boolean, type: string, id: string, likes: number, dislikes: number, comments: number }) {
    const [like, setLike] = React.useState<true | false | null>(null);
    const [likes, setLikes] = React.useState(props.likes);
    const [dislikes, setDislikes] = React.useState(props.dislikes);
    const [prevState, setPrevState] = React.useState<any>({like: null, likes: props.likes, dislikes: props.dislikes});
    async function onClick(type: string) {
        if (type === 'like' && like !== true) {
            if (like === false) {
                setDislikes(dislikes - 1);
            }
            setLike(true);
            setLikes(likes + 1);
            const result = await fetch(`/api/v1/likes/${props.type}/${props.id}/like`,
             {method: 'POST', credentials: 'same-origin'});
            if (result.status !== 200) {
                setLike(prevState.like);
                setLikes(prevState.likes);
                setDislikes(prevState.dislikes);
                return;
            }
            setPrevState({like: like, likes: likes, dislikes: dislikes});
            const data = await result.json();
            setLikes(data.likes);
            setDislikes(data.dislikes);

        } else if (type === 'dislike' && like !== false) {
            if (like === true) {
                setLikes(likes - 1);
            }
            setLike(false);
            setDislikes(dislikes + 1);

        }
    }
    return (
        props.isLoading ?
            <Skeleton className="w-32 h-6 my-auto" variant="rounded"/> :
            <div className="flex space-x-2 font-semibold mb-2">
                <Like count={likes} pressed={like} onClick={() => onClick("like")}/>
                <Dislike count={dislikes} pressed={like} onClick={() => onClick("dislike")}/>
                <Comment count={props.comments}/>
            </div>);
}
