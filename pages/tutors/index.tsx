import React from "react";
import SEO from "../../components/seo";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {a11yProps} from "../../helpers/utils";
import Image from "next/image";
import MiniCat from "../../images/minicat_transparent.svg";
import LikeIco from "../../images/like.svg";
import CommentIco from "../../images/comment.svg";
import Comment from "../../components/comment";
import ProfileIco from "../../images/profile3.png";
import GoldenCrown from "../../images/golden_crown.svg";
import SilverCrown from "../../images/silver_crown.svg";
import BronzeCrown from "../../images/bronze_crown.svg";
import SearchIcon from "@mui/icons-material/Search";
import {styled} from "@mui/material/styles";
import Checkbox from "@mui/material/Checkbox";
import Input from "@mui/material/Input";
import ArrowUp from "../../images/arrow_up.svg";
import CheckIcon from '@mui/icons-material/Check';
import Favorite from "@mui/icons-material/Favorite";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import blue from "@mui/material/colors/blue";
import Slider from "@mui/material/Slider";
import Star from "@mui/icons-material/Star";
import {DataGrid, GridColDef, GridRowsProp} from '@mui/x-data-grid';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
// import { useDemoData } from '@mui/x-data-grid-generator';


const StyledInput = styled(Input)(() => ({
    width: '100%',
    fontSize: '1.2rem',
    fontFamily: 'Montserrat',
    marginLeft: '0.5rem'
}));

const StyledSlider = styled(Slider)(() => ({
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
}));


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
// sx={{
//     color: '#808080',
//         fontFamily: 'Montserrat',
//         '& .MuiSlider-track': {
//         height: 3,
//     },
//     '& .MuiSlider-thumb': {
//         height: 14,
//             width: 14
//     },
// }}


const rows: GridRowsProp = [
    {id: 1, col1: 'Hello', col2: 'World'},
    {id: 2, col1: 'DataGridPro', col2: 'is Awesome'},
    {id: 3, col1: 'MUI', col2: 'is Amazing'},
];

const columns: GridColDef[] = [
    {field: 'col1', headerName: 'Column 1'},
    {field: 'col2', headerName: 'Column 2'},
];

function BasicExampleDataGrid() {

    return (
        <div style={{height: 400, width: '100%'}}>
            <DataGrid rows={rows} columns={columns}/>
        </div>
    );
}


function Tutors() {

    const [value, setValue] = React.useState<number[]>([0, 5]);

    const handleChange = (event: Event, newValue: number | number[]) => {
        setValue(newValue as number[]);
    };

    return (
        <>
            <SEO title={'Преподаватели'}/>
            <div className="flex-wrap w-full">
                <div className="text-[1.7rem] mt-[0.5rem] h-[3rem] text-center">Преподаватели</div>
                <div className="w-full h-[1px] bg-black bg-opacity-10 mb-4"/>
                <div className="flex w-full justify-between">
                    <div className="w-[75%]">
                        {/*<BasicExampleDataGrid/>*/}
                        <div className="rounded-2xl p-6 text-[1.7rem] bg-white bg-opacity-90">
                            <table className="table-auto w-full">
                                <thead>
                                <tr>
                                    <th className="font-medium">#</th>
                                    <th className="text-left pl-4 font-medium">Имя</th>
                                    <th className="font-medium">Рейтинг</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                <tr>
                                    <td className="text-center">1</td>
                                    <td>
                                        <div className="flex pl-4 h-[4.5rem]">
                                            <div className="h-14 my-auto w-14 flex">
                                                <Image
                                                    src={ProfileIco}
                                                    alt="Profile pic"
                                                    className="rounded-full"
                                                />
                                                <div className="h-8 my-auto w-8 absolute ml-[2rem] -mt-[0.85rem]">
                                                    <Image
                                                        src={GoldenCrown}
                                                        alt="Golden crown"
                                                        className="rounded-full"
                                                    />
                                                </div>
                                            </div>
                                            <div className="text-[0.8rem] h-fit my-auto ml-2">Burunduk</div>
                                        </div>
                                    </td>
                                    <td className="text-center">3.1 K</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="w-[15rem]">
                        <div className="bg-white bg-opacity-90 flex border
                                             border-gray-200 shadow align-middle
                                             rounded-lg flex-row h-9 mx-auto mb-2">
                            <SearchIcon style={{color: 'black'}} className="scale-100 my-auto ml-2 opacity-30"/>
                            <StyledInput
                                placeholder="Поиск"
                                inputProps={{'aria-label': 'Поиск'}}
                                disableUnderline
                                sx={{fontSize: '1rem'}}
                            />
                        </div>
                        <div className="rounded-lg pt-3 pb-4 px-2.5 text-[1rem] w-full bg-white bg-opacity-90
                        flex-wrap space-y-5">
                            <div>
                                <button className="flex">
                                    <div className="h-3 w-3 flex my-auto mr-2">
                                        <Image
                                            src={ArrowUp}
                                            alt="Arrow up"
                                        />
                                    </div>
                                    <div className="my-auto font-semibold">Факультеты</div>
                                </button>
                                <div className="bg-white bg-opacity-90 flex shadow border
                                             border-gray-200 align-middle
                                             rounded-lg flex-row h-9 mx-auto my-2.5">
                                    <SearchIcon style={{color: 'black'}} className="scale-100 my-auto ml-2 opacity-30"/>
                                    <StyledInput
                                        placeholder="Поиск"
                                        inputProps={{'aria-label': 'Поиск'}}
                                        disableUnderline
                                        sx={{fontSize: '1rem'}}
                                    />
                                </div>
                                <div className="-ml-2">
                                    <div className="flex">
                                        <Checkbox
                                            // sx={{
                                            //     // color: blue[800],
                                            //     '&.Mui-checked': {
                                            //         color: blue[600],
                                            //     },
                                            // }}
                                            color="default"
                                            icon={<div className="w-[1.1rem] h-[1.1rem] border-[1.5px] m-0.5
                                             border-black rounded"/>}
                                            checkedIcon={
                                                <div className="w-[1.1rem] h-[1.1rem] border-[1.5px] m-0.5
                                             border-black rounded bg-gray-500 flex align-middle justify-center">
                                                    <CheckIcon
                                                        sx={{
                                                            marginTop: '-2px',
                                                            height: '1.1rem',
                                                            width: '1.1rem'
                                                        }}
                                                        color="primary"/>
                                                </div>}
                                        />
                                        <div className="my-auto">ИИКС</div>
                                    </div>
                                    <div className="flex">
                                        <Checkbox
                                            // sx={{
                                            //     // color: blue[800],
                                            //     '&.Mui-checked': {
                                            //         color: blue[600],
                                            //     },
                                            // }}
                                            color="default"
                                            icon={<div className="w-[1.1rem] h-[1.1rem] border-[1.5px] m-0.5
                                             border-black rounded"/>}
                                            checkedIcon={
                                                <div className="w-[1.1rem] h-[1.1rem] border-[1.5px] m-0.5
                                             border-black rounded bg-gray-500 flex align-middle justify-center">
                                                    <CheckIcon
                                                        sx={{
                                                            marginTop: '-2px',
                                                            height: '1.1rem',
                                                            width: '1.1rem'
                                                        }}
                                                        color="primary"/>
                                                </div>}
                                        />
                                        <div className="my-auto">ФБИУКС</div>
                                    </div>
                                </div>
                                <div className="flex ml-1 w-full text-[0.75rem] pr-2">
                                    <button className="underline flex">
                                        <div className="mr-1">Показать всё</div>
                                        <div className="h-2 w-2 flex my-auto">
                                            <Image
                                                src={ArrowUp}
                                                alt="Arrow up"
                                                className="rotate-180"
                                            />
                                        </div>
                                    </button>
                                    <button className="underline ml-auto">Сбросить</button>

                                </div>
                            </div>
                            <div>
                                <button className="flex">
                                    <div className="h-3 w-3 flex my-auto mr-2">
                                        <Image
                                            src={ArrowUp}
                                            alt="Arrow up"
                                        />
                                    </div>
                                    <div className="my-auto font-semibold">Предмет</div>
                                </button>
                                <div className="bg-white bg-opacity-90 flex shadow border
                                             border-gray-200 align-middle
                                             rounded-lg flex-row h-9 mx-auto my-2.5">
                                    <SearchIcon style={{color: 'black'}} className="scale-100 my-auto ml-2 opacity-30"/>
                                    <StyledInput
                                        placeholder="Поиск"
                                        inputProps={{'aria-label': 'Поиск'}}
                                        disableUnderline
                                        sx={{fontSize: '1rem'}}
                                    />
                                </div>
                                <div className="-ml-2">
                                    <div className="flex">
                                        <Checkbox
                                            // sx={{
                                            //     // color: blue[800],
                                            //     '&.Mui-checked': {
                                            //         color: blue[600],
                                            //     },
                                            // }}
                                            color="default"
                                            icon={<div className="w-[1.1rem] h-[1.1rem] border-[1.5px] m-0.5
                                             border-black rounded"/>}
                                            checkedIcon={
                                                <div className="w-[1.1rem] h-[1.1rem] border-[1.5px] m-0.5
                                             border-black rounded bg-gray-500 flex align-middle justify-center">
                                                    <CheckIcon
                                                        sx={{
                                                            marginTop: '-2px',
                                                            height: '1.1rem',
                                                            width: '1.1rem'
                                                        }}
                                                        color="primary"/>
                                                </div>}
                                        />
                                        <div className="my-auto">Матан</div>
                                    </div>
                                    <div className="flex">
                                        <Checkbox
                                            // sx={{
                                            //     // color: blue[800],
                                            //     '&.Mui-checked': {
                                            //         color: blue[600],
                                            //     },
                                            // }}
                                            color="default"
                                            icon={<div className="w-[1.1rem] h-[1.1rem] border-[1.5px] m-0.5
                                             border-black rounded"/>}
                                            checkedIcon={
                                                <div className="w-[1.1rem] h-[1.1rem] border-[1.5px] m-0.5
                                             border-black rounded bg-gray-500 flex align-middle justify-center">
                                                    <CheckIcon
                                                        sx={{
                                                            marginTop: '-2px',
                                                            height: '1.1rem',
                                                            width: '1.1rem'
                                                        }}
                                                        color="primary"/>
                                                </div>}
                                        />
                                        <div className="my-auto">Ангем</div>
                                    </div>
                                </div>
                                <div className="flex ml-1 w-full text-[0.75rem] pr-2">
                                    <button className="underline flex">
                                        <div className="mr-1">Показать всё</div>
                                        <div className="h-2 w-2 flex my-auto">
                                            <Image
                                                src={ArrowUp}
                                                alt="Arrow up"
                                                className="rotate-180"
                                            />
                                        </div>
                                    </button>
                                    <button className="underline ml-auto">Сбросить</button>

                                </div>
                            </div>
                            <div>
                                <button className="flex">
                                    <div className="h-3 w-3 flex my-auto mr-2">
                                        <Image
                                            src={ArrowUp}
                                            alt="Arrow up"
                                        />
                                    </div>
                                    <div className="my-auto font-semibold">Оценка</div>
                                </button>
                                <div className="px-2">
                                    <StyledSlider
                                        aria-label="Temperature"
                                        value={value}
                                        onChange={handleChange}
                                        valueLabelDisplay="auto"
                                        step={0.1}
                                        marks={marks}
                                        min={0.5}
                                        max={5}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

}

export default Tutors;



