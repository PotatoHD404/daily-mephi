import React from "react";

export function RoundedImageSvg({data, radius}: { data: string, radius: number }) {
    return <svg width={radius * 2} height={radius * 2} xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink">

        <g clipPath="url(#cut-off-circle)">
            <rect width={radius * 2} height={radius * 2} fill="url(#pattern0)"/>
        </g>
        <circle cx={radius} cy={radius} r={radius - 1} stroke="#A9A3A3" strokeWidth="2.2" fill="none"/>
        <defs>
            <clipPath id="cut-off-circle">
                <circle cx={radius} cy={radius} r={radius}/>
            </clipPath>
            <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                <use xlinkHref="#image" transform="matrix(0.005 0 0 0.005 0 0)"/>
                <image id="image" width="200" height="200" xlinkHref={data}/>
            </pattern>
        </defs>

    </svg>
}


export function Div({children, tw, style}: { children?: React.ReactNode, tw?: string, style?: any }) {
    // @ts-ignore
    return <div tw={tw} style={style}>{children}</div>;
}

export function H1({children, tw}: { children?: React.ReactNode, tw?: string }) {
    // @ts-ignore
    return <h1 tw={tw}>{children}</h1>;
}

export function H2({children, tw}: { children?: React.ReactNode, tw?: string }) {
    // @ts-ignore
    return <h2 tw={tw}>{children}</h2>;
}

export function H3({children, tw}: { children?: React.ReactNode, tw?: string }) {
    // @ts-ignore
    return <h3 tw={tw}>{children}</h3>;
}

export function H4({children, tw}: { children?: React.ReactNode, tw?: string }) {
    // @ts-ignore
    return <h4 tw={tw}>{children}</h4>;
}

export function Span({children, tw}: { children?: React.ReactNode, tw?: string }) {
    // @ts-ignore
    return <span tw={tw}>{children}</span>;
}


function Img({
                 children,
                 tw,
                 src,
                 alt = "",
                 width,
                 height,
                 style
             }: {
    children?: React.ReactNode,
    tw?: string,
    src: string,
    alt?: string,
    width: number,
    height: number,
    style?: any
}) {
    // @ts-ignore
    return <img tw={tw} alt={alt} src={src} width={width} height={height} style={style}>{children}</img>;
}

function A({children, tw, href}: { children?: React.ReactNode, tw?: string, href?: string }) {
    // @ts-ignore
    return <a tw={tw} href={href}>{children}</a>;
}
