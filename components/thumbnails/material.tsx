// example jsx component
import React from 'react';
import Image, {StaticImageData} from "next/future/image";
import DeadCat from "images/dead_cat.svg";

interface MType {
    name: string,
    rating: number,
    legacy_rating: number,
    reviews: number,
    quotes: number,
    materials: number,
    image_url: string
}



export default async function Material(
    {
        name,
        rating,
        legacy_rating,
        reviews,
        quotes,
        materials,
        image_url
    }: MType) {

    return <>
        <h1>{name}</h1>
        <h2>{rating}</h2>
        <h2>{legacy_rating}</h2>
        <h2>{reviews}</h2>
        <h2>{quotes}</h2>
        <h2>{materials}</h2>
        <Image src={image_url}  alt={""} width={150} height={150}/>
    </>;
}
