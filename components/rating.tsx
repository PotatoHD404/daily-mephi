import StarIcon from '@mui/icons-material/Star';

import {Rating} from '@mui/material';
import React from "react";
import useMediaQuery from "../helpers/react/useMediaQuery";

const labels: { [index: string]: string } = {
    0.5: 'Невыносимо',
    1: 'Ужасно',
    1.5: 'Плохо',
    2: 'Слабо',
    2.5: 'Средне',
    3: 'Лучше среднего',
    3.5: 'Нормально',
    4: 'Хорошо',
    4.5: 'Замечательно',
    5: 'Идеально',
};

export default function HoverRating() {
    const [value, setValue] = React.useState<number | null>(null);
    const [hover, setHover] = React.useState<number | null>(null);
    const isMobile = useMediaQuery(768);
    return (
        <div className="flex flex-wrap md:w-[22rem] justify-end md:justify-start">
            {isMobile ?
            <div>
                <Rating
                    name="hover-feedback"
                    value={value}
                    precision={0.5}
                    size="medium"
                    onChange={(event, newValue) => {
                        setValue(newValue);
                    }}
                    onChangeActive={(event, newHover) => {
                        setHover(newHover);
                    }}
                    emptyIcon={<StarIcon style={{opacity: 0.55}} fontSize="inherit"/>}
                />
            </div>
            :
            <>
                <div>
                    <Rating
                        name="hover-feedback"
                        value={value}
                        precision={0.5}
                        size="large"
                        onChange={(event, newValue) => {
                            setValue(newValue);
                        }}
                        onChangeActive={(event, newHover) => {
                            setHover(newHover);
                        }}
                        emptyIcon={<StarIcon style={{opacity: 0.55}} fontSize="inherit"
                        />}
                    />
                </div>
                <div className="w-fit ml-8">
                    {hover != null && hover != -1 ? labels[hover] : value != null ? labels[value] : null}
                </div>
            </>
            }

        </div>
    );
}
