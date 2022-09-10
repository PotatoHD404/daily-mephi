import React from "react";
import SEO from "components/seo";
import Material from "components/material";
import {FilterButtons, Filters} from "components/filters";


const marks = [
    {
        value: 0.5,
        label: (<div>0.5</div>),
    },
    {
        value: 5,
        label: (<div>5</div>),
    },
];


function Materials() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    return (
        <>
            <SEO title='Материалы'/>

            <div className="flex flex-wrap w-full justify-center">
                <h1 className="text-2xl mb-2 font-semibold">Материалы</h1>
                <FilterButtons/>
                <div className="w-full h-[1px] bg-black bg-opacity-10"/>
                <div className="flex">
                    <div className="md:w-[75%] w-[100%]">
                        <Material/>
                        <Material/>
                    </div>
                    <Filters/>
                </div>
            </div>
        </>);

}

export default Materials;



