import * as React from 'react';
import StarIcon from '@mui/icons-material/Star';

import { Rating, Box } from '@mui/material';

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
    const [value, setValue] = React.useState<number | null>(-1);
    const [hover, setHover] = React.useState(-1);

    return (
        <div className="flex flex-wrap md:w-[22rem] justify-end md:justify-start">
            <div className="md:hidden">
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
                    className="md:hidden"
                />
            </div>
            <div className="hidden md:block">
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
            <div className="w-fit hidden md:block ml-8">
                {value !== null ? labels[hover !== -1 ? hover : value] : null}
            </div>
        </div>
    );
}
