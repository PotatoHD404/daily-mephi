// example jsx component
import React from 'react';
import Material from "components/thumbnails/material";
import Tutor from "images/tutor.png"

interface MType {
    name: string,
    rating: number,
    legacy_rating: number,
    reviews: number,
    quotes: number,
    materials: number,
    image_url: string | null
}

export default function ExampleMaterial() {
    return <Material
        name={"Трифоненков В.П."}
        rating={4.5}
        legacy_rating={2.1}
        reviews={5}
        quotes={3}
        materials={3}
        image_url={Tutor}/>
}
