// example jsx component
import React, {useEffect, useState} from 'react';
import Material from "components/thumbnails/material";
import Tutor from "images/tutor.png"
import DeadCat from "../../images/dead_cat.svg";
import {imageToBase64, normalizeUrl} from "lib/react/imageToBase64";


export default function ExampleMaterial() {
    const [component, setComponent] = useState(<></>);
    useEffect(() => {
        const url = normalizeUrl(Tutor, DeadCat);
        const image_data = imageToBase64(url);
        image_data.then((data: string) => Material({
            name: "Трифоненков В.П.",
            rating: 4.5,
            legacy_rating: 2.1,
            reviews: 5,
            quotes: 3,
            materials: 3,
            image_url: data
        })).then((value: React.SetStateAction<JSX.Element>) => {
            setComponent(value);
        });
    }, [])
    return component;
}
