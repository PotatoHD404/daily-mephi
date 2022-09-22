import React from "react";
import Image from "next/image";
import {Slider} from "@mui/material";
import StarIcon from "../images/star.svg";
import CustomAccordion from './customAccordion'
import {toChildArray} from "preact";

const dev = process.env.NODE_ENV == "development";
//                                     />
export default function SliderFilter(props: { name: string, min: number, max: number }) {
    const [value, setValue] = React.useState<number[]>([0, 5]);
    const handleChange = (event: Event, newValue: number | number[]) => {
        setValue(newValue as number[]);
    };

    function Mark(props: { value: string | number, mt?: boolean }) {
        return <div className={`${props.mt ? "-mt-2" : ""} flex`}>
            <div className="my-auto text-[0.95rem]">{props.value.toString()}</div>
            <div className="flex w-3.5 ml-0.5 my-auto">
                <Image
                    src={StarIcon}
                    alt="Tutor image"
                    className="my-auto"
                />
            </div>
        </div>;
    }

    const marks = [
        {
            value: 0,
            label: <Mark mt value={0}/>,
        },
        {
            value: 5,
            label: <Mark mt value={5}/>,
        },
    ];


    return <CustomAccordion name={props.name}>
        <div className="flex flex-wrap px-4">
            <div className="flex space-x-1 -ml-1">
                <Mark value={value[0]}/>
                <div>-</div>
                <Mark value={value[1]}/>
            </div>
            <Slider
                // @ts-ignore
                value={dev ? toChildArray(value.map((v, index) => <div key={index}>{v.toString()}</div>)) : value}
                // onChange={(event, newValue) => {
                //     console.log(newValue);
                // }}
                // defaultValue={[0, 2]}
                onChange={handleChange}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                getAriaValueText={(value) => `${value}₽`}
                step={0.5}
                min={props.min}
                max={props.max}
                className="mx-2 -mt-2"
                marks={marks}
                sx={{
                    color: '#000',
                    height: 2,

                    '& .MuiSlider-thumb': {
                        width: 8,
                        height: 8,
                        transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                        '&:before': {
                            boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
                        },
                        '&:hover, &.Mui-focusVisible': {
                            boxShadow: `0px 0px 0px 8px rgb(0 0 0 / 16%)`,
                        },
                        '&.Mui-active': {
                            width: 20,
                            height: 20,
                        },
                    },
                    '& .MuiSlider-rail': {
                        opacity: 0.28,
                    },
                    '& .MuiSlider-markLabel': {fontFamily: 'Montserrat'},
                    '& .MuiSlider-valueLabel': {
                        lineHeight: 1.2,
                        fontSize: 12,
                        background: 'unset',
                        padding: 0,
                        width: 32,
                        height: 32,
                        borderRadius: '50% 50% 50% 0',
                        backgroundColor: '#000',
                        transformOrigin: 'bottom left',
                        transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
                        '&:before': {display: 'none'},
                        '&.MuiSlider-valueLabelOpen': {
                            transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
                        },
                        '& > *': {
                            transform: 'rotate(45deg)',
                        },
                        fontFamily: 'Montserrat'
                    }
                }}
            />
        </div>
    </CustomAccordion>
}
