// example jsx component
import React from 'react';
import {Div, H1, H2, H3, RoundedImageSvg} from "./svgElements";
import {Materials, Quotes, Reviews} from "./images";
import {getNoun} from "lib/getNoun";

interface UType {
    name: string,
    rating: number,
    reviews: number,
    quotes: number,
    materials: number,
    image_url: string
}

// bg-[#00ff00] bg-opacity-20
export default function User(
    {
        name,
        rating,
        reviews,
        quotes,
        materials,
        image_url,
    }: UType) {
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
                <Div tw="flex w-full my-16 flex-wrap">
                    <Div tw="flex w-full">
                        <Div tw="flex flex-wrap w-1/2 mx-[100px] mt-8">
                            <H1 tw="text-[60px] font-bold text-wrap">{name}</H1>
                            {/*<H2 tw="flex flex-nowrap font-semibold w-4/5 text-[40px] mt-4">*/}
                            {/*    <Div tw="flex ">Курс:</Div>*/}
                            {/*    <Div tw="flex ml-4">{course}</Div>*/}
                            {/*</H2>*/}
                            <H2 tw="flex flex-nowrap font-semibold w-4/5 text-[40px] mt-4">
                                <Div tw="flex">Рейтинг:</Div>
                                <Div tw="flex ml-4">{rating}</Div>
                            </H2>
                        </Div>
                        <Div tw="flex w-1/3">
                            <RoundedImageSvg data={image_url} radius={175}/>
                        </Div>
                    </Div>
                    <H3 tw="text-[30px] font-medium flex w-4/5 justify-between mx-auto mt-3 opacity-50">
                        Выложено:
                    </H3>
                    <Div tw="flex w-4/5 justify-between mx-auto mt-3">
                        <Div tw="flex w-auto">
                            <Div tw="flex opacity-50"><Reviews/></Div>
                            <Div tw="flex flex-wrap flex-col ml-4">
                                <H3 tw="text-[30px] font-semibold -mt-1">{reviews}</H3>
                                <H3 tw="text-[30px] text-black opacity-50 font-medium -mt-1">
                                    {getNoun(reviews, "Отзыв", "Отзыва", "Отзывов")}
                                </H3>
                            </Div>

                        </Div>
                        <Div tw="flex w-auto">
                            <Div tw="flex opacity-50"><Quotes/></Div>
                            <Div tw="flex flex-wrap flex-col ml-4">
                                <H3 tw="text-[30px] font-semibold -mt-1">{quotes}</H3>
                                <H3 tw="text-[30px] text-black opacity-50 font-medium -mt-1">
                                    {getNoun(quotes, "Цитата", "Цитаты", "Цитат")}
                                </H3>
                            </Div>

                        </Div>
                        <Div tw="flex w-auto">
                            <Div tw="flex opacity-50"><Materials/></Div>

                            <Div tw="flex flex-wrap flex-col ml-4">
                                <H3 tw="text-[30px] bg-opacity-20 -mt-1">{materials}</H3>
                                <H3 tw="text-[30px] text-black opacity-50 font-medium -mt-1">
                                    {getNoun(materials, "Материал", "Материала", "Материалов")}
                                </H3>
                            </Div>

                        </Div>
                    </Div>
                </Div>
            </Div>
        </Div>);
}
