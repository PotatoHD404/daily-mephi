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
        <>
            <div className="w-full mt-3">
                <Box sx={{borderBottom: 1, borderColor: 'divider'}} className="mb-4">
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" variant="fullWidth"
                          TabIndicatorProps={{style: {background: 'white'}}}>
                        <Tab label={
                            <div className="flex-row h-11 w-[13rem]">
                                <div className="flex h-11 my-auto">
                                    <Image
                                        src={profileIco}
                                        alt="Profile ico"
                                    />
                                </div>
                                <div className="text-black text-3xl font-[Montserrat] normal-case my-auto">Профиль</div>
                            </div>
                        } {...a11yProps(0)}
                        />
                        <Tab label={
                            <div className="flex-row h-11 w-[11.5rem]">
                                <div className="flex h-11 my-auto">
                                    <Image
                                        src={reviewsIco}
                                        alt="Reviews ico"
                                    />
                                </div>
                                <div className="text-black text-3xl font-[Montserrat] normal-case my-auto">Отзывы</div>
                            </div>
                        } {...a11yProps(1)}
                        />
                        <Tab label={
                            <div className="flex-row h-11 w-[11rem]">
                                <div className="flex h-11 my-auto">
                                    <Image
                                        src={quotesIco}
                                        alt="Quotes ico"
                                    />
                                </div>
                                <div className="text-black text-3xl font-[Montserrat] normal-case my-auto">Цитаты</div>
                            </div>
                        } {...a11yProps(2)}
                        />
                        <Tab label={
                            <div className="flex-row h-11 w-[14.5rem]">
                                <div className="flex h-11 my-auto">
                                    <Image
                                        src={materialsIco}
                                        alt="Materials ico"
                                    />
                                </div>
                                <div className="text-black text-3xl font-[Montserrat] normal-case my-auto">Материалы
                                </div>
                            </div>
                        } {...a11yProps(3)}
                        />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                    {value == 0 ?
                        <div className="mx-12 greenBox font-[Montserrat] flex">
                            <div className="greenBox w-[28%] grid">
                                <div className="h-[459px] flex">
                                    <Image
                                        src={TutorImage}
                                        alt="Picture of the author"
                                        quality={100}
                                        objectFit="cover"
                                        placeholder="blur"
                                    />
                                </div>

                                <div>Daily</div>
                            </div>
                            <div className="greenBox w-[66.5%] ml-14 rounded-3xl p-14 grid gap-4">
                                <div className="text-4xl font-semibold">Трифоненков Владимир Петрович</div>
                                <div className="">
                                    <div className="text-3xl font-semibold underline greenBox w-fit">Дисциплины:</div>
                                    <div className="text-3xl greenBox"> Теория функций комплексных переменных, Математический
                                        анализ, Линейная алгебра, Интегральные уравнения, Дифференциальные уравнения
                                    </div>
                                </div>

                                <div className="text-3xl font-semibold underline">Кафедры:</div>
                                <div className="grid gap-8 mt-32">
                                    <div className="text-3xl font-bold">Характер:</div>
                                    <div className="text-3xl font-bold">Качество преподавания:</div>
                                    <div className="text-3xl font-bold">Приём зачётов/экзаменов:</div>
                                </div>

                            </div>
                        </div>
                        : <></>}
                </TabPanel>
                <TabPanel value={value} index={1}>
                    {value == 1 ? <>Item One {console.log(1)}</> : <></>}
                </TabPanel>
                <TabPanel value={value} index={2}>
                    {value == 2 ? <>Item One {console.log(2)}</> : <></>}
                </TabPanel>
                <TabPanel value={value} index={3}>
                    {value == 3 ? <>Item One {console.log(3)}</> : <></>}
                </TabPanel>
            </div>
        </>);

}

export default Tutor;



