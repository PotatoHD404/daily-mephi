import {useRouter} from "next/router";
import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import React, {useEffect, useMemo} from "react";
import {ReviewType} from "../lib/database/types";
import UserHeader from "./userHeader";
import Reactions from "./reactions";
import Comments from "./comments";
import LoadingBlock from "./loadingBlock";

import {CircularProgress} from "@mui/material";

export function Review({review}: { review: ReviewType }) {
    return (<div className="text-[1.7rem] w-full whiteBox">
        <UserHeader user={review.user}
                    legacyNickname={review.legacyNickname}
                    date={review.createdAt}/>
        <h1 className="font-bold text-[1.1rem] leading-6">{review.header}</h1>
        <div className="mb-2 text-[1.0rem] leading-5">{review.body}</div>
        <Reactions type={"review"} id={review.id} likes={review.likes} dislikes={review.dislikes} comments={review.commentCount}/>
        <div className="w-full bg-black mx-auto mb-4 h-[2px]"/>
        <Comments/>
    </div>);
}

export default function Reviews({tutorId}: { tutorId: string }) {
    const router = useRouter();
    const {review: reviewId} = router.query;

    async function fetchReviews(cursor: any) {
        // parse dates to Date objects
        return await (await fetch(`/api/v1/tutors/${tutorId}/reviews?cursor=${cursor}`, {
            method: 'GET',
            credentials: 'same-origin'
        }))?.json();
    }

    async function fetchReview() {
        const result = await (await fetch(`/api/v1/reviews/${reviewId}`, {
            method: 'GET',
            credentials: 'same-origin'
        }))?.json();
        // parse dates to Date objects
        result.createdAt = new Date(result.createdAt);
        return result;
    }

    // @ts-ignore
    const {data: data1, isFetching, refetch} = useQuery([`tutor-${tutorId}-reviews-${reviewId}`], fetchReview, {
        cacheTime: 0,
        refetchOnWindowFocus: false,
        enabled: false // disable this query from automatically running
    });

    function getCursor(lastPage: { next_cursor: any; }) {
        return lastPage.next_cursor ?? undefined;
        // return lastPage.reviews_count;
    }


    const {data, hasNextPage, fetchNextPage, isFetchingNextPage} = useInfiniteQuery(
        [`tutor-${tutorId}-reviews`],
        ({pageParam = 0}) => fetchReviews(pageParam),
        // @ts-ignore
        {
            // @ts-ignore
            getNextPageParam: (lastPage) => {
                return getCursor(lastPage);
            },
            refetchOnWindowFocus: false,
            enabled: true
        }
    )
    const reviews = useMemo(() => {
        const added = new Set();
        // @ts-ignore
        const result = data?.pages.flatMap(page => page.reviews.filter((review: any) => {
            if (added.has(review.id)) return false;
            added.add(review.id);
            return true;
        })).map((review: any) => {
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
    const isLoading = hasNextPage === undefined || isFetchingNextPage || (reviewId !== undefined && isFetching);

    return (
        <>
            {/* {reviewId && !isLoading && <Review review={data1}/>} */}
            {reviews.length > 0 ?
                reviews.map((review, index) => (review.id != reviewId ?
                    <Review key={index} review={review}/>
                    : null))
                : !isLoading && <div>Отзывов пока нет</div>}
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
