import React, {useEffect} from "react";
import SEO from "components/seo";
import {GetServerSideProps} from "next";
import {useRouter} from "next/router";
import {prisma} from "lib/database/prisma";
import {UUID_REGEX} from "lib/constants/uuidRegex";


function Review({review}: { review: any }) {
    const router = useRouter();
    return (
        <>
            <SEO title={`${review.header}`}
                 thumbnail={`https://daily-mephi.ru/api/v2/thumbnails/reviews/${review.id}.png`}/>
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
                    shortName: true,
                }
            },
            title: true,
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

