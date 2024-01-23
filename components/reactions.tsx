import Like from "./likeBtn";
import Dislike from "./dislikeBtn";
import Comment from "./commentBtn";
import {Skeleton} from "@mui/material";
import React from "react";
import {trpc} from "../server/utils/trpc";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import {getTokens} from "../lib/react/getTokens";


export default function Reactions(props: {
    isLoading?: boolean,
    type: "news" | "material" | "review" | "comment" | "quote",
    id: string,
    likes: number,
    dislikes: number,
    comments: number
}) {
    const [like, setLike] = React.useState<true | false | null>(null);
    const [likes, setLikes] = React.useState(props.likes);
    const [dislikes, setDislikes] = React.useState(props.dislikes);
    const [prevState, setPrevState] = React.useState<any>({like: null, likes: props.likes, dislikes: props.dislikes});

    async function apply_result(type: 'like' | 'dislike' | 'unlike') {
        let data: { likesCount: number, dislikesCount: number };
        try {
            const tokens = await getTokens(executeRecaptcha);
            data = await mutateReactions.mutateAsync({
                type,
                ...tokens,
                targetType: props.type,
                targetId: props.id
            })
        } catch (e) {
            setLike(prevState.like);
            setLikes(prevState.likes);
            setDislikes(prevState.dislikes);
            console.log(e);
            return;
        }
        setPrevState({like: like, likes: likes, dislikes: dislikes});
        setLikes(data.likesCount);
        setDislikes(data.dislikesCount);
    }

    const mutateReactions = trpc.reactions.change.useMutation();
    const {executeRecaptcha} = useGoogleReCaptcha();

    async function onClick(type: string) {
        if (type === 'like' && like !== true) {
            if (like === false) {
                setDislikes(dislikes - 1);
            }
            setLike(true);
            setLikes(likes + 1);
            await apply_result('like');
        } else if (type === 'dislike' && like !== false) {
            setLike(false);
            if (like === true) {
                setLikes(likes - 1);
            }
            setDislikes(dislikes + 1);
            await apply_result('dislike');
        } else if (type === 'dislike' && like === false || type === 'like' && like === true) {
            if (!like) {
                setDislikes(dislikes - 1);
            } else {
                setLikes(likes - 1);
            }
            setLike(null);
            await apply_result('unlike');
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
