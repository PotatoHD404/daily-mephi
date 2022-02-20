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
import LikeIco from '../../images/like.svg';
import CommentIco from '../../images/comment.svg'
import Divider from "@mui/material/Divider";
import Comment from "../../components/comment";
import QuoteIco from "../../images/quote.svg"

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
            <div className="rounded-2xl flex-row bg-white bg-opacity-90 py-12 px-8">
                <div className="w-[36.8%] mr-12 text-2xl font-bold">
                    <div className="flex-row -mt-2 mb-10 w-fit relative mx-auto">
                        <Image
                            src={TutorImage}
                            alt="Tutor image"
                            className="rounded-full z-0"
                        />
                        <div className="rounded-full bg-gray-300 w-20 h-20 px-2 py-5 underline
                     right-2 top-2 mt-2 z-10 absolute">
                            №46
                        </div>
                    </div>

                    <div className="flex flex-wrap w-[74%] mx-auto">
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
                    <div className="bottom-0 absolute w-full space-y-7 font-semibold">
                        <div className="text-xl flex-row">
                            <div>Характер(4.6):</div>
                            <HoverRating/>
                        </div>
                        <div className="text-xl flex-row">
                            <div>Характер(4.6):</div>
                            <HoverRating/>
                        </div>
                        <div className="text-xl flex-row">
                            <div>Характер(4.6):</div>
                            <HoverRating/>
                        </div>
                        <div className="text-xl flex-row">
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
                {/* mt-14 */}
                <div className="mt-[4.3rem] mx-auto">
                    {value == 0 ?
                        <div className="flex-wrap space-y-10 w-full">
                            <div className="rounded-2xl p-6 text-[1.7rem] w-full bg-white bg-opacity-[90%]">
                                <div className="flex-row w-full mb-7">
                                    <div className="h-14 my-auto w-14 ">
                                        <Image
                                            src={ProfilePicture2}
                                            alt="Profile picture"
                                            className="rounded-full"
                                        />
                                    </div>
                                    <span className="font-bold ml-2 my-auto">User1</span>
                                    <span className="ml-2 my-auto ml-8">15 февраля 2022</span>
                                </div>
                                <textarea
                                    className="rounded-2xl appearance-none block w-full bg-gray-200 text-gray-700
                                 border border-gray-200 py-3 px-4 focus:outline-none
                                  focus:bg-gray-100 focus:border-gray-500 transition-colors h-28 mb-3"
                                    placeholder="Оставить отзыв"/>
                                <div className="flex-row space-x-4 font-semibold">
                                    <div className="h-fit flex-row space-x-2">
                                        <div className="h-6 my-auto flex w-6">
                                            <Image
                                                src={LikeIco}
                                                alt="Like"
                                            />
                                        </div>
                                        <div className="text-xl mt-0.5">?</div>
                                    </div>
                                    <div className="flex-row space-x-2 h-fit">
                                        <div className="h-6 my-auto flex w-6 mt-2">
                                            <Image
                                                src={LikeIco}
                                                alt="Dislike"
                                                className="rotate-180"
                                            />
                                        </div>
                                        <div className="text-xl my-auto">?</div>
                                    </div>
                                    <div className="flex-row space-x-2">
                                        <div className="h-6 my-auto flex w-6  mt-2">
                                            <Image
                                                src={CommentIco}
                                                alt="Comment"
                                            />
                                        </div>
                                        <div className="text-xl my-auto">?</div>
                                    </div>
                                </div>
                            </div>


                            <div className="rounded-2xl p-6 text-[1.7rem] w-full bg-white bg-opacity-90">
                                <div className="flex-row w-full mb-4">
                                    <div className="h-14 my-auto w-14">
                                        <Image
                                            src={ProfilePicture2}
                                            alt="Mini cat"
                                            className="rounded-full"
                                        />
                                    </div>
                                    <span className="font-bold ml-2 my-auto">User1</span>
                                    <span className="ml-2 my-auto ml-8">15 февраля 2022</span>
                                </div>
                                <div className="font-bold">Заголовок</div>
                                <div className="mb-4">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci
                                    aut autem
                                    dolores dolorum enim esse excepturi fugit, inventore laboriosam magnam nihil
                                    officiis possimus qui recusandae repudiandae sed sequi sunt temporibus.
                                </div>
                                <div className="flex-row space-x-4 font-semibold mb-4">
                                    <div className="h-fit flex-row space-x-2">
                                        <div className="h-6 my-auto flex w-6">
                                            <Image
                                                src={LikeIco}
                                                alt="Like"
                                            />
                                        </div>
                                        <div className="text-xl mt-0.5">?</div>
                                    </div>
                                    <div className="flex-row space-x-2 h-fit">
                                        <div className="h-6 my-auto flex w-6 mt-2">
                                            <Image
                                                src={LikeIco}
                                                alt="Dislike"
                                                className="rotate-180"
                                            />
                                        </div>
                                        <div className="text-xl my-auto">?</div>
                                    </div>
                                    <div className="flex-row space-x-2">
                                        <div className="h-6 my-auto flex w-6  mt-2">
                                            <Image
                                                src={CommentIco}
                                                alt="Comment"
                                            />
                                        </div>
                                        <div className="text-xl my-auto">?</div>
                                    </div>
                                </div>
                                <Divider className="w-full bg-black mx-auto mb-4"/>
                                <div className="flex-wrap space-y-5">
                                    <Comment><Comment/></Comment>
                                    <Comment/>
                                </div>
                            </div>
                        </div>
                        : null}
                    {value == 1 ?
                        <div className="flex-wrap space-y-10 w-full">
                            <div>
                                <div className="flex-row w-full text-[1rem] relative mb-2 pl-4">
                                    <span className="font-bold mr-4 my-auto text-[1rem]">Uploaded by:</span>
                                    <div className="h-8 my-auto w-8">
                                        <Image
                                            src={ProfilePicture2}
                                            alt="Profile picture"
                                            className="rounded-full"
                                        />
                                    </div>
                                    <span className="font-bold ml-2 my-auto text-[0.95rem]">User1</span>
                                    <span className="absolute my-auto right-4 mt-1">15 февраля 2022</span>
                                </div>
                                <div className="rounded-2xl p-6 text-[1.7rem] w-full bg-white bg-opacity-[90%]">
                                    <div className="relative flex-row mt-8">
                                        <div className="h-8 w-8">
                                            <Image
                                                src={QuoteIco}
                                                alt="Quote symbol"
                                            />
                                        </div>
                                        <div className="italic w-[80%] mx-auto">Lorem ipsum dolor sit amet, consectetur adipisicing
                                            elit. Delectus eius laboriosam magni neque obcaecati provident rem
                                            repellendus. Consequuntur dolorem, excepturi illum iste maxime modi nesciunt
                                            pariatur, sed sunt tempora, ullam?
                                        </div>
                                        <div className="h-8 w-8 mt-auto">
                                            <Image
                                                src={QuoteIco}
                                                alt="Quote symbol"
                                                className="rotate-180"
                                            />
                                        </div>
                                    </div>
                                    <div className="text-center my-2 font-semibold">Трифоненков В.П.</div>
                                    <div className="flex-row space-x-4 font-semibold">
                                        <div className="h-fit flex-row space-x-2">
                                            <div className="h-6 my-auto flex w-6">
                                                <Image
                                                    src={LikeIco}
                                                    alt="Like"
                                                />
                                            </div>
                                            <div className="text-xl mt-0.5">?</div>
                                        </div>
                                        <div className="flex-row space-x-2 h-fit">
                                            <div className="h-6 my-auto flex w-6 mt-2">
                                                <Image
                                                    src={LikeIco}
                                                    alt="Dislike"
                                                    className="rotate-180"
                                                />
                                            </div>
                                            <div className="text-xl my-auto">?</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        : null}
                    {value == 2 ?
                        <div className="flex-wrap space-y-10 w-full">
                            <div>
                                <div className="flex-row w-full text-[1rem] relative mb-2 pl-4">
                                    <span className="font-bold mr-4 my-auto text-[1rem]">Uploaded by:</span>
                                    <div className="h-8 my-auto w-8">
                                        <Image
                                            src={ProfilePicture2}
                                            alt="Profile picture"
                                            className="rounded-full"
                                        />
                                    </div>
                                    <span className="font-bold ml-2 my-auto text-[0.95rem]">User1</span>
                                    <span className="absolute my-auto right-4 mt-1">15 февраля 2022</span>
                                </div>
                                <div className="rounded-2xl p-6 text-[1.7rem] w-full bg-white bg-opacity-[90%]">
                                    <div className="relative flex-row mt-8">
                                        <div className="h-8 w-8">
                                            <Image
                                                src={QuoteIco}
                                                alt="Quote symbol"
                                            />
                                        </div>
                                        <div className="italic w-[80%] mx-auto">Lorem ipsum dolor sit amet, consectetur adipisicing
                                            elit. Delectus eius laboriosam magni neque obcaecati provident rem
                                            repellendus. Consequuntur dolorem, excepturi illum iste maxime modi nesciunt
                                            pariatur, sed sunt tempora, ullam?
                                        </div>
                                        <div className="h-8 w-8 mt-auto">
                                            <Image
                                                src={QuoteIco}
                                                alt="Quote symbol"
                                                className="rotate-180"
                                            />
                                        </div>
                                    </div>
                                    <div className="text-center my-2 font-semibold">Трифоненков В.П.</div>
                                    <div className="flex-row space-x-4 font-semibold">
                                        <div className="h-fit flex-row space-x-2">
                                            <div className="h-6 my-auto flex w-6">
                                                <Image
                                                    src={LikeIco}
                                                    alt="Like"
                                                />
                                            </div>
                                            <div className="text-xl mt-0.5">?</div>
                                        </div>
                                        <div className="flex-row space-x-2 h-fit">
                                            <div className="h-6 my-auto flex w-6 mt-2">
                                                <Image
                                                    src={LikeIco}
                                                    alt="Dislike"
                                                    className="rotate-180"
                                                />
                                            </div>
                                            <div className="text-xl my-auto">?</div>
                                        </div>
                                        <div className="flex-row space-x-2">
                                            <div className="h-6 my-auto flex w-6  mt-2">
                                                <Image
                                                    src={CommentIco}
                                                    alt="Comment"
                                                />
                                            </div>
                                            <div className="text-xl my-auto">?</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        : null}
                </div>


            </div>
        </div>);

}

export default Tutor;



