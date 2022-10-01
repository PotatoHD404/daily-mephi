import React, {useEffect} from "react";
import SEO from "components/seo";
import {GetServerSideProps} from "next";
import {useRouter} from "next/router";
import prisma from "lib/database/prisma";
import {UUID_REGEX} from "lib/uuidRegex";

function Quote({quote}: { quote: any }) {
    const router = useRouter();
    useEffect(() => {
        router.push(`/tutors/${quote.tutorId}?quote=${quote.id}`);
    });
    return (
        <>
            <SEO title={`Цатата ${quote.tutorName}`}
                 thumbnail={`https://daily-mephi.ru/api/v1/thumbnails/quotes/${quote.id}.png`}/>
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
    const quote = await prisma.quote.findUnique({
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
            }
        }
    });
    if (!quote) {
        return {
            notFound: true
        }
    }
    // @ts-ignore
    quote.tutorId = quote.tutor.id;

    // @ts-ignore
    delete quote.tutor;

    // get material from database

    // res.setHeader(
    //     'Cache-Control',
    //     'public, s-maxage=10, stale-while-revalidate=59'
    // )

    return {
        props: {quote}
    }
}


export default Quote;

