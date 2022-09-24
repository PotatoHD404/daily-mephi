import {useRouter} from "next/router";
import {useInfiniteQuery} from "@tanstack/react-query";
import React, {useEffect} from "react";
import {toChildArray} from "preact";
import {ReviewType} from "../lib/database/types";
import UserHeader from "./userHeader";
import {Skeleton} from "@mui/material";
import Reactions from "./reactions";
import Comments from "./comments";

export default function Reviews({tutorId}: { tutorId: string }) {
    const router = useRouter();
    const {review: reviewId} = router.query;

    async function fetchReviews(cursor: any) {
        return await (await fetch(`/api/v1/tutors/${tutorId}/reviews?cursor=${cursor}`, {
            method: 'GET',
            credentials: 'same-origin'
        }))?.json();
    }

    function getCursor(lastPage: { reviews_count: number; }) {
        // return lastPage.reviews_count > pages.length ? pages.length : undefined;
        return lastPage.reviews_count;
    }

    const {data, hasNextPage, fetchNextPage, isFetchingNextPage, refetch} = useInfiniteQuery(
        [`tutor-${tutorId}-reviews`],
        ({pageParam = 0}) => fetchReviews(pageParam),
        {
            getNextPageParam: (lastPage) => {
                return getCursor(lastPage);
            },
            cacheTime: 0,
            refetchOnWindowFocus: false,
            enabled: false
        }
    )
    // useEffect(() => {
    //     if (data) {
    //         setPages(data.pages);
    //     }
    // });
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

    const isLoading = isFetchingNextPage || !data;
    useEffect(() => {
        if (data && !isFetchingNextPage && data.pages.length > 0) {
            // pages.push(...data.pages[data.pages.length - 1]);
            // setPages([...pages]);
            console.log(data);
        }
    }, [data, isFetchingNextPage]);

    return (
        <>
            {/*{pages.length > 0 ?*/}
            {/*    toChildArray(pages.map((review, index) => (review != reviewId ?*/}
            {/*        <Review key={index} review={review}/>*/}
            {/*        : null)))*/}
            {/*    : <div>Цитат пока нет</div>}*/}
            {isLoading ?
                <>
                    <Review isLoading={true}/>
                    <Review isLoading={true}/>
                    <Review isLoading={true}/>
                </>
                : null
            }

        </>
    );
}
function Review({review, isLoading}: { review?: ReviewType, isLoading?: boolean }) {
    return (<div className="text-[1.7rem] w-full whiteBox">
        <UserHeader user={review?.user}
                    legacyNickname={review?.legacyNickname}
                    date={review?.createdAt}
                    isLoading={isLoading}/>
        {isLoading ?
            <>
                <Skeleton className="w-full h-6 mt-2" variant="rounded"/>
                <Skeleton className="w-full h-6 mt-2" variant="rounded"/>
                <Skeleton className="w-full h-6 mt-2 mb-2" variant="rounded"/>
            </> :
            <>
                <h1 className="font-bold text-[1.1rem] leading-6">{review?.header}</h1>
                <div className="mb-2 text-[1.0rem] leading-5">{review?.body}</div>
            </>
        }
        <Reactions isLoading={isLoading}/>
        {!isLoading ? <>
            <div className="w-full bg-black mx-auto mb-4 h-[2px]"/>
            <Comments/>
        </> : null}
    </div>);
}
