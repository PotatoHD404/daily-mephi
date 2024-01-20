import React, {useEffect} from "react";
import SEO from "components/seo";
import {GetServerSideProps} from "next";
import {prisma} from "lib/database/prisma";
import {UUID_REGEX} from "lib/constants/uuidRegex";
import {useRouter} from "next/router";


function Material({material}: { material: any }) {
    const router = useRouter();
    useEffect(() => {
        router.push(`/tutors/${material.tutorId}?material=${material.id}`);
    });
    return (
        <>
            <SEO title={`${material}`}
                 thumbnail={`https://daily-mephi.ru/api/v2/thumbnails/materials/${material.id}.png`}/>
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
    const material = await prisma.material.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            title: true,
            tutorId: true,
        }
    });
    if (!material) {
        return {
            notFound: true
        }
    }
    // get material from database

    // res.setHeader(
    //     'Cache-Control',
    //     'public, s-maxage=10, stale-while-revalidate=59'
    // )

    return {
        props: {material}
    }
}

export default Material;

