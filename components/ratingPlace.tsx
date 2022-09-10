import React from "react";

export default function RatingPlace(props: {place: number}) {
    return <div className="rounded-full outline-black w-8 h-8 md:w-10 md:h-10
                                    border-[0.12rem] border-gray-800 font-semibold text-center pt-[0.1rem]
                                     md:pt-[0.35rem] leading-0 text-xl">
        {props.place}
    </div>;
}
