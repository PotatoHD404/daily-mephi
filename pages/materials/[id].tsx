import React from "react";
import SEO from "components/seo";
import useIsMobile from "../../helpers/react/isMobileContext";
import {NextApiRequest, NextApiResponse} from "next";


function Material({id}: { id: string | string[] | undefined }) {
    const isMobile = useIsMobile();
    return (
        <>
            <SEO title={'Материал'} thumbnail={`https://daily-mephi.ru/api/v1/thumbnails/materials/${id}.png`}/>
            {isMobile == null ? null :
                <div className="flex-wrap w-full">
                </div>
            }
        </>
    );

}

export async function getServerSideProps({req, res}: { req: NextApiRequest, res: NextApiResponse }): Promise<any> {
    const {id} = req.query;
    // get material from database

    // res.setHeader(
    //     'Cache-Control',
    //     'public, s-maxage=10, stale-while-revalidate=59'
    // )

    return {
        props: {id}
    }
}


export default Material;

