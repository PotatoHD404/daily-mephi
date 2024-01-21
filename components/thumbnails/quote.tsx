// example jsx component
import React from 'react';
import {Div, H2, H3} from "./svgElements";
import {Quote as QuoteImg} from "./images";

interface QType {
    name: string,
    text: string,
}

// bg-[#00ff00] bg-opacity-20
export default function Quote(
    {
        name,
        text
    }: QType) {
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
                <Div tw="flex w-full my-20 flex-wrap">
                    <Div tw="flex w-auto flex-col mx-[140px]">

                        <Div tw="flex w-auto mr-auto -ml-[70px]"><QuoteImg/></Div>
                        <Div tw="flex w-full -my-2">
                            <H2 tw="flex flex-wrap font-medium italic text-[30px]">
                                {text}
                            </H2>
                        </Div>
                        <Div tw="flex w-auto ml-auto -mr-[70px]"><QuoteImg rotated/></Div>
                    </Div>
                    <H3 tw="flex w-auto mx-auto justify-between mx-auto mt-6 font-semibold text-[40px]">
                        {name}
                    </H3>
                </Div>
            </Div>
        </Div>);
}
