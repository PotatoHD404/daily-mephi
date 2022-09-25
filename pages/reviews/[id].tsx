import React, {useEffect} from "react";
import SEO from "components/seo";
import useIsMobile from "../../lib/react/isMobileContext";
import {GetServerSideProps, NextApiRequest, NextApiResponse} from "next";
import {UUID_REGEX} from "../api/v1/tutors/[id]/materials";
import {useRouter} from "next/router";
import prisma from "../../lib/database/prisma";


function Review({review}: { review: any }) {
    const router = useRouter();
    useEffect(() => {
        router.push(`/tutors/${review.tutorId}?review=${review.id}`);
    });
    return (
        <>
            <SEO title={`${review.header}`} thumbnail={`https://daily-mephi.ru/api/v1/thumbnails/reviews/${review.id}.png`}/>
        </>
    );

}

export const getServerSideProps: GetServerSideProps = async ({query}) => {
    const {id} = query;
    if (!id || typeof id != "string" || !id.match(UUID_REGEX)) {
        return {
            notFound: true
        }
    }
    const review = await prisma.review.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            tutor: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    fatherName: true,
                }
            },
            header: true,
        }
    });
    if (!review) {
        return {
            notFound: true
        }
    }
    // @ts-ignore
    review.tutorId = review.tutor.id;
    // @ts-ignore
    review.tutorName = getTutorName(review.tutor);
    // @ts-ignore
    delete review.tutor;
    // get material from database

    // res.setHeader(
    //     'Cache-Control',
    //     'public, s-maxage=10, stale-while-revalidate=59'
    // )

    return {
        props: {review}
    }
}

export default Review;

