// example jsx component
import React from 'react';

interface MType {
    name: string,
    rating: number,
    legacy_rating: number,
    reviews: number,
    quotes: number,
    materials: number,
    image_url: string
}

function Div({children, tw}: { children: React.ReactNode, tw?: string }) {
    // @ts-ignore
    return <div tw={tw}>{children}</div>;
}

function H1({children, tw}: { children: React.ReactNode, tw?: string }) {
    // @ts-ignore
    return <h1 tw={tw}>{children}</h1>;
}

function H2({children, tw}: { children: React.ReactNode, tw?: string }) {
    // @ts-ignore
    return <h2 tw={tw}>{children}</h2>;
}

function H3({children, tw}: { children: React.ReactNode, tw?: string }) {
    // @ts-ignore
    return <h3 tw={tw}>{children}</h3>;
}

function H4({children, tw}: { children: React.ReactNode, tw?: string }) {
    // @ts-ignore
    return <h4 tw={tw}>{children}</h4>;
}

function Span({children, tw}: { children: React.ReactNode, tw?: string }) {
    // @ts-ignore
    return <span tw={tw}>{children}</span>;
}

function Img({children, tw}: { children: React.ReactNode, tw?: string }) {
    // @ts-ignore
    return <img tw={tw} alt={""}>{children}</img>;
}

function A({children, tw, href}: { children: React.ReactNode, tw?: string, href?: string }) {
    // @ts-ignore
    return <a tw={tw} href={href}>{children}</a>;
}

export default async function Material(
    {
        name,
        rating,
        legacy_rating,
        reviews,
        quotes,
        materials,
        image_url,
    }: MType) {
    return <Div tw="flex flex-col w-full h-full items-center justify-center bg-white">
        <Div tw="bg-gray-50 flex w-full">
            <Div tw="flex flex-col md:flex-row w-full py-12 px-4 md:items-center justify-between p-8">
                <H2 tw="flex flex-col text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 text-left">
                    <Span>Ready to dive in?</Span>
                    <Span tw="text-indigo-600">Start your free trial today.</Span>
                </H2>
                <Div tw="mt-8 flex md:mt-0">
                    <Div tw="flex rounded-md shadow">
                        <A tw="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-5 py-3 text-base font-medium text-white">Get
                            started</A>
                    </Div>
                    <Div tw="ml-3 flex rounded-md shadow">
                        <A tw="flex items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-indigo-600">Learn
                            more</A>
                    </Div>
                </Div>
            </Div>
        </Div>
    </Div>
    // return <Div style={{display: "flex"}}>
    //     <Div style={{
    //         height: '100%',
    //         width: '100%',
    //         display: 'flex',
    //         textAlign: 'center',
    //         alignItems: 'center',
    //         justifyContent: 'center',
    //         flexDirection: 'column',
    //         flexWrap: 'nowrap',
    //         backgroundColor: 'white',
    //         backgroundImage: 'radial-gradient(circle at 15px 15px, lightgray 2%, transparent 0%), radial-gradient(circle at 45px 45px, lightgray 2%, transparent 0%)',
    //         backgroundSize: '60px 60px',
    //     }}>
    //
    //         <Div style={{width: "66%", backgroundColor: "rgba(0, 255, 0, 0.2)", display: "flex"}}>
    //             <h1>{name}</h1>
    //             <h2>{rating}</h2>
    //             <h2>{legacy_rating}</h2>
    //         </Div>
    //         <Div style={{width: "auto", margin: "auto", backgroundColor: "rgba(0, 255, 0, 0.2)", display: "flex"}}>
    //             <img src={image_url} alt={""} width={350} height={350}/>
    //         </Div>
    //     </Div>
    //     <Div style={{display: "flex"}}>
    //         <h2>{reviews}</h2>
    //         <h2>{quotes}</h2>
    //         <h2>{materials}</h2>
    //     </Div>
    // </Div>
    //     ;
}
