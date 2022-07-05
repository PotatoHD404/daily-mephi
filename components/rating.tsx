import * as React from 'react';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';

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
    const [value, setValue] = React.useState<number | null>(2);
    const [hover, setHover] = React.useState(-1);

    return (
        <Box
            sx={{
                width: 400,
                display: 'flex',
                alignItems: 'center',
                marginLeft: 'auto'
            }}
        >
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
                emptyIcon={<StarIcon style={{opacity: 0.55}} fontSize="inherit"/>}
            />
            {value !== null && (
                <Box sx={{ml: 2}}>{labels[hover !== -1 ? hover : value]}</Box>
            )}
        </Box>
    );
}