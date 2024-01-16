import {useRouter} from "next/router";
import React, {useEffect, useMemo} from "react";
import UserHeader from "./userHeader";
import Reactions from "./reactions";
import Comments from "./comments";
import LoadingBlock from "./loadingBlock";

import {CircularProgress} from "@mui/material";
import {UUID_REGEX} from "lib/constants/uuidRegex";
import {RouterOutputs, trpc} from "server/utils/trpc";

export type ReviewType = RouterOutputs['reviews']['getFromTutor'][0];

export function Review({review}: { review: ReviewType }) {
    return (<div className="text-[1.7rem] w-full whiteBox">
        <UserHeader user={review.user}
                    legacyNickname={review.legacyNickname}
                    date={review.createdAt}/>
        <h1 className="font-bold text-[1.1rem] leading-6">{review.title}</h1>
        <div className="mb-2 text-[1.0rem] leading-5">{review.text}</div>
        <Reactions type={"review"} id={review.id} likes={review.likesCount} dislikes={review.dislikesCount}
                   comments={review.commentsCount}/>
        <div className="w-full bg-black mx-auto mb-4 h-[2px]"/>
        <Comments/>
    </div>);
}

export default function Reviews({tutorId}: { tutorId: string }) {
    const router = useRouter();
    const {review: reviewId} = router.query;


    const validReviewId = typeof reviewId === "string" && UUID_REGEX.test(reviewId) ? reviewId : null;
    const validTutorId = UUID_REGEX.test(tutorId) ? tutorId : null;
    const {data: data1, isFetching, refetch} = validReviewId ?
        trpc.reviews.getOne.useQuery({id: validReviewId}) : {
            data: null,
            isFetching: false,
            refetch: () => {

            }
        };


    const {
        data,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage
    } = trpc.reviews.getFromTutor.useInfiniteQuery({id: tutorId}, {
        getNextPageParam: (reviews) => {
            return reviews[reviews.length - 1].id;
        },
    })

    const reviews = useMemo(() => {
        const added = new Set();
        const result = data?.pages.flatMap(reviews => reviews.filter((review) => {
            if (added.has(review.id)) return false;
            added.add(review.id);
            return true;
        })).map((review) => {
            review.createdAt = new Date(review.createdAt);
            return review;
        }) ?? [];

        if (data1) {
            result.unshift(data1);
        }

        return result;

    }, [data, data1]);
    useEffect(() => {
        if (reviewId) {
            refetch();
        }
    }, [reviewId]);
    useEffect(() => {
        let fetching = false;
        const handleScroll = async (e: any) => {
            const {scrollHeight, scrollTop, clientHeight} = e.target.scrollingElement;
            if (!fetching && scrollHeight - scrollTop <= clientHeight * 1.2) {
                fetching = true
                if (hasNextPage) await fetchNextPage()
                fetching = false
            }
        }
        document.addEventListener('scroll', handleScroll)
        return () => {
            document.removeEventListener('scroll', handleScroll)
        }
    }, [fetchNextPage, hasNextPage]);
    if (!validReviewId || !validTutorId) {
        // router.push('/404');
        return (<></>);
    }

    const isLoading = hasNextPage === undefined || isFetchingNextPage || isFetching;

    return (
        <>
            {/* {reviewId && !isLoading && <Review review={data1}/>} */}
            {reviews.length > 0 ?
                reviews.map((review, index) => {
                    if (review.id !== reviewId) {
                        return <Review key={index} review={review}/>
                    } else return null;
                }) : !isLoading && <div>Отзывов пока нет</div>}
            {isLoading && reviews.length === 0 ?
                <>
                    <LoadingBlock/>
                    <LoadingBlock/>
                    <LoadingBlock/>
                </>
                : null
            }
            {isLoading && reviews.length > 0 &&
                <div className="mx-auto w-fit pt-12">
                    {/* mui spinning circle */}
                    <CircularProgress color={"inherit"}/>
                </div>}


        </>
    );
}
