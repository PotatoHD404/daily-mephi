// example jsx component
import React from 'react';
import {Div, H1, RoundedImageSvg} from "./svgElements";

interface MType {
    name: string,
    image_url: string
    title: string,
    text: string,
    tags: string[]
}

// bg-[#00ff00] bg-opacity-20
export default function Material(
    {
        name,
        image_url,
        title,
        text,
        tags
    }: MType) {
    const colors = [
        "#F9C5D3",
        "#C7A8F3",
        "#FEB3B4",
        "#F4BDE6",
        "#DDD9DF",
    ]
    tags = tags.slice(0, 5)
    const tagsWithColors = tags.map((tag, index) => {
        return {label: tag, color: colors[index]}
    });
    return (
        <Div tw="flex flex-col w-full h-full bg-white">
            <Div style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                textAlign: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                flexWrap: 'nowrap',
                backgroundColor: 'white',
                backgroundImage: 'radial-gradient(circle at 18.75px 18.75px, lightgray 2%, transparent 0%), radial-gradient(circle at 56.25px 56.25px, lightgray 2%, transparent 0%)',
                backgroundSize: '75px 75px',
            }}>
                <Div tw="flex flex-wrap my-24">
                    <Div tw="flex w-2/3 flex-wrap">
                        <Div tw="flex flex-wrap w-auto mx-[40px]">
                            <Div tw="flex flex-wrap bg-gray-300 bg-opacity-50 rounded-[20px] h-[420px] px-[10px]">
                                <Div tw="flex w-full mt-6 mx-auto">
                                    <H1 tw="mx-auto font-semibold text-[45px]">
                                        {title}
                                    </H1>
                                </Div>
                                <Div tw="flex h-[175px]">
                                    <Div tw="font-medium text-[30px] my-auto">{text}</Div>
                                </Div>
                                <Div tw="flex flex-wrap">
                                    {tagsWithColors.map((tag, index) => (
                                        <Div
                                            tw={`rounded font-bold text-[30px] bg-[${tag.color}] mr-2 mb-1 py-1 px-4 w-fit whitespace-nowrap`}
                                            key={index}>
                                            {tag.label}
                                        </Div>
                                    ))}
                                </Div>
                            </Div>
                        </Div>

                    </Div>
                    <Div tw="flex w-1/3 flex-col">
                        <Div tw="flex mx-auto">
                            <RoundedImageSvg data={image_url} radius={175}/>
                        </Div>
                        <H1 tw="flex mx-auto font-semibold text-[45px] ">
                            {name}
                        </H1>
                    </Div>
                </Div>
            </Div>
        </Div>);
}
