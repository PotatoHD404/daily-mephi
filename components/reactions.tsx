import Like from "./likeBtn";
import Dislike from "./dislikeBtn";
import Comment from "./commentBtn";
import {Skeleton} from "@mui/material";
import React from "react";
import {trpc} from "../server/utils/trpc";
import {getCsrfToken} from "next-auth/react";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import {getTokens} from "../lib/react/getTokens";

async function apply_result(result: Response,
                            setLike: (value: (((prevState: (boolean | null)) => (boolean | null)) | boolean | null)) => void,
                            prevState: any, setLikes: (value: (((prevState: number) => number) | number)) => void,
                            setDislikes: (value: (((prevState: number) => number) | number)) => void,
                            setPrevState: (value: any) => void, like: boolean | null,
                            likes: number,
                            dislikes: number) {
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
}

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
    const mutateReactions = trpc.reactions.change.useMutation();
    const {executeRecaptcha} = useGoogleReCaptcha();
    async function onClick(type: string) {
        if (type === 'like' && like !== true) {
            if (like === false) {
                setDislikes(dislikes - 1);
            }
            setLike(true);
            setLikes(likes + 1);
            // const result = await fetch(`/api/v1/reactions`,
            //     {
            //         method: 'PUT',
            //         credentials: 'same-origin',
            //         headers: {
            //             'Content-Type': 'application/json',
            //         },
            //         body: JSON.stringify({
            //             reaction: 'like',
            //             type: props.type,
            //             id: props.id
            //         })
            //     });
            const tokens = await  getTokens(executeRecaptcha);
            const result = await mutateReactions.mutateAsync({
                type: 'like',
                ...tokens,
                targetType: props.type,
                targetId: props.id
            })
            await apply_result(result, setLike, prevState, setLikes, setDislikes, setPrevState, like, likes, dislikes);
        } else if (type === 'dislike' && like !== false) {
            setLike(false);
            if (like === true) {
                setLikes(likes - 1);
            }
            setDislikes(dislikes + 1);
            const result = await fetch(`/api/v1/reactions`,
                {
                    method: 'PUT',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        reaction: 'dislike',
                        type: props.type,
                        id: props.id
                    })
                });

            // const data =

            await apply_result(result, setLike, prevState, setLikes, setDislikes, setPrevState, like, likes, dislikes);
        } else if (type === 'dislike' && like === false || type === 'like' && like === true) {
            if (!like) {
                setDislikes(dislikes - 1);
            } else {
                setLikes(likes - 1);
            }
            setLike(null);
            const result = await fetch(`/api/v1/reactions`,
                {

                    method: 'DELETE',
                    credentials: 'same-origin',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        reaction: 'unlike',
                        type: props.type,
                        id: props.id
                    })
                });
            await apply_result(result, setLike, prevState, setLikes, setDislikes, setPrevState, like, likes, dislikes);
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
