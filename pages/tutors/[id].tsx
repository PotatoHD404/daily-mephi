import {NextRouter, withRouter} from "next/router";
import React, {Component} from "react";
import {Session} from "next-auth";
import TutorImage from '../../images/tutor.png'
import Image from "next/image";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {styled} from "@mui/material/styles";
import {alpha, SliderProps, withStyles} from "@mui/material";
import profileIco from '../../images/profile.svg';
import reviewsIco from '../../images/reviews.svg';
import quotesIco from '../../images/quotes.svg';
import materialsIco from '../../images/materials.svg';
import HoverRating from "../../components/rating";
import ProfilePicture1 from '../../images/profile1.png';
import ProfilePicture2 from '../../images/profile2.png';
import Like from '../../images/like.svg';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{p: 3}}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


function Tutor() {

    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    // constructor(props: any) {
    //     super(props);
    //     this.state = {id: ''};
    // }
    //
    // static getDerivedStateFromProps(props: any, state: any) {
    //     return {...state, id: props.router.query.id};
    // }

    // bg-white bg-opacity-[36%]
    // bg-white bg-opacity-[80%]
    // ID: {this.state.id}
    return (
        <div className="flex-wrap w-full">
            <div className="font-bold text-3xl w-fit mx-auto mb-5">Трифоненков Владимир Петрович</div>
            <div className="rounded-2xl flex-row greenBox py-12 px-8">
                <div className="w-[36.8%] mr-12 greenBox text-2xl font-bold relative">
                    <div className="flex -mt-2 mb-10">
                        <Image
                            src={TutorImage}
                            alt="Tutor image"
                        />
                    </div>
                    <div
                        className="rounded-full greenBox w-20 h-20 px-2 py-5 underline absolute right-0 top-0 mt-2">№46
                    </div>
                    <div className="flex flex-wrap w-[74%] mx-auto greenBox">
                        <div className="my-auto flex-row w-full">
                            <div>Daily Mephi:</div>
                            <div className="ml-auto">4.5</div>
                        </div>
                        <div className="my-auto flex-row w-full mt-3">
                            <div>mephist.ru:</div>
                            <div className="ml-auto">2.1</div>
                        </div>
                    </div>
                </div>
                <div className="w-[83%] text-2xl relative">
                    <div>
                        <span className="font-bold pr-4">Дисциплины:</span>
                        <span>Теория функций копмплексных переменных, Математический анализ, Линейная алгебра, Интегральные
                        уравнения, Дифференциальные уравнения
                    </span>
                    </div>
                    <div className="mt-5">
                        <span className="font-bold pr-4">Кафедра:</span>
                        <span>30</span>
                    </div>
                    <div className="bottom-0 absolute w-full space-y-7">
                        <div className="text-xl greenBox flex-row">
                            <div>Характер(4.6):</div>
                            <HoverRating/>
                        </div>
                        <div className="text-xl greenBox flex-row">
                            <div>Характер(4.6):</div>
                            <HoverRating/>
                        </div>
                        <div className="text-xl greenBox flex-row">
                            <div>Характер(4.6):</div>
                            <HoverRating/>
                        </div>
                        <div className="text-xl greenBox flex-row">
                            <div>Характер(4.6):</div>
                            <HoverRating/>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full mt-7">
                <Box sx={{borderBottom: 1, borderColor: 'divider'}} className="mb-4">
                    <Tabs value={value} onChange={handleChange} variant="fullWidth"
                          TabIndicatorProps={{style: {background: 'white'}}}>
                        <Tab label={
                            <div className="flex-row h-8  w-[11.5rem]">
                                {/*<div className="flex h-10 my-auto">*/}
                                {/*    <Image*/}
                                {/*        src={reviewsIco}*/}
                                {/*        alt="Reviews ico"*/}
                                {/*    />*/}
                                {/*</div>*/}
                                <div className="text-black text-[1.7rem] font-[Montserrat] normal-case my-auto">Отзывы
                                </div>
                            </div>
                        } {...a11yProps(0)}
                        />
                        <Tab label={
                            <div className="flex-row h-8  w-[11rem]">
                                {/*<div className="flex h-10 my-auto">*/}
                                {/*    <Image*/}
                                {/*        src={quotesIco}*/}
                                {/*        alt="Quotes ico"*/}
                                {/*    />*/}
                                {/*</div>*/}
                                <div className="text-black text-[1.7rem] font-[Montserrat] normal-case my-auto">Цитаты
                                </div>
                            </div>
                        } {...a11yProps(1)}
                        />
                        <Tab label={
                            <div className="flex-row h-8 w-[14.5rem]">
                                {/*<div className="flex h-10 my-auto">*/}
                                {/*    <Image*/}
                                {/*        src={materialsIco}*/}
                                {/*        alt="Materials ico"*/}
                                {/*    />*/}
                                {/*</div>*/}
                                <div
                                    className="text-black text-[1.7rem] font-[Montserrat] normal-case my-auto">Материалы
                                </div>
                            </div>
                        } {...a11yProps(2)}
                        />
                    </Tabs>
                </Box>
                <div className="mt-14">
                    {value == 0 ?
                        <div className="greenBox flex-row">
                            <div className="h-[4.7rem] my-auto w-[4.7rem] ">
                                <Image
                                    src={ProfilePicture2}
                                    alt="Mini cat"
                                    className="rounded-full"
                                />
                            </div>
                            <div className="h-[4.7rem] my-auto w-[4.7rem] ml-5 flex-row">
                                <Image
                                    src={Like}
                                    alt="Like"
                                />
                            </div>
                            <div className="h-[4.7rem] my-auto w-[4.7rem] ml-5 flex-row">
                                <Image
                                    src={Like}
                                    alt="Dislike"
                                    className="rotate-180"
                                />
                            </div>
                        </div>
                        : null}
                    {value == 1 ?
                        <div className="greenBox">
                            test1
                        </div>
                        : null}
                    {value == 2 ?
                        <div className="greenBox">
                            test2
                        </div>
                        : null}
                </div>


            </div>
        </div>);

}

export default Tutor;



