// example jsx component
import React from 'react';
import {Div, H1, RoundedImageSvg} from "./svgElements";

interface RType {
    tutor_name: string,
    user_name: string,
    tutor_image_url: string,
    user_image_url: string
    title: string,
    text: string
}

// bg-[#00ff00] bg-opacity-20
export default function Review(
    {
        tutor_name,
        user_name,
        tutor_image_url,
        user_image_url,
        title,
        text
    }: RType) {
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
                            <Div tw="flex w-auto">
                                <Div tw="flex w-auto my-auto">
                                    <RoundedImageSvg data={tutor_image_url} radius={27.75}/>
                                </Div>
                                <H1 tw="flex w-auto font-semibold text-[40px] ml-4">
                                    {tutor_name}
                                </H1>
                            </Div>
                            <Div tw="flex flex-wrap bg-gray-300 bg-opacity-50 rounded-[20px] h-[300px] px-[10px] mt-12">
                                <Div tw="flex w-full mt-6 mx-auto">
                                    <H1 tw="mx-auto font-semibold text-[45px]">
                                        {title}
                                    </H1>
                                </Div>
                                <Div tw="flex h-[175px]">
                                    <Div tw="font-medium text-[30px] my-auto">{text}</Div>
                                </Div>
                            </Div>
                        </Div>
                    </Div>
                    <Div tw="flex w-1/3 flex-col">
                        <Div tw="flex mx-auto">
                            <RoundedImageSvg data={user_image_url} radius={175}/>
                        </Div>
                        <H1 tw="flex mx-auto font-semibold text-[45px] ">
                            {user_name}
                        </H1>
                    </Div>
                </Div>
            </Div>
        </Div>);
}
