import React from "react";
import TutorImage from 'images/tutor.png'
import Image from "next/image";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import HoverRating from "components/rating";
import ProfilePicture2 from 'images/profile2.png';
import LikeIco from 'images/like.svg';
import CommentIco from 'images/comment.svg'
import Comment from "components/comment";
import QuoteIco from "images/quote.svg";
import DownloadIco from 'images/download.svg';
import {a11yProps} from 'helpers/reactUtils'
import SEO from "components/seo";
import {useRouter} from "next/router";
import styles from "styles/tutors.module.css";
import {LikeComponent} from "components/like";
import {DislikeComponent} from "components/dislike";
import {CommentComponent} from "components/commentComponent";
import {Comments} from "components/comments";


// function QuoteIconComponent(props: { src: any }) {
//     return <div className="flex h-10 my-auto">
//         <Image
//             src={props.src}
//             alt="Quotes ico"
//         />
//     </div>;
// }
//
// function ReviewsIconComponent(props: { src: any }) {
//     return <div className="flex h-10 my-auto">
//         <Image
//             src={props.src}
//             alt="Reviews ico"
//         />
//     </div>;
// }
//
// function MaterialsIconComponent(props: { src: any }) {
//     return <div className="flex h-10 my-auto">
//         <Image
//             src={props.src}
//             alt="Materials ico"
//         />
//     </div>;
// }

function RatingComponent(props: { text: string }) {
    return (
        <div className="flex justify-between w-auto text-[0.9rem]">
            <div className="w-fit h-fit">{props.text}</div>
            <div className="w-fit"><HoverRating/></div>
        </div>)
        ;
}

function UserHeaderComponent(props: { name: string, date: string }) {
    return <div className="flex w-full mb-3 content-center items-center">
        <div className="h-14 my-auto w-14">
            <Image
                src={ProfilePicture2}
                alt="Profile picture"
                className="rounded-full"
            />
        </div>
        <div className="ml-2 h-fit">
            <div className="font-bold text-[0.9rem] leading-5">{props.name}</div>
            <div className="text-[0.8rem] leading-5 my-auto opacity-60">{props.date}</div>
        </div>

    </div>;
}

function Tutor() {
    const router = useRouter()
    const {id} = router.query
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
            {/*<SEO title={'Трифоненков В.П.'} card={`https://daily-mephi.vercel.app/api/cover?type=tutor&id=${id}`}/>*/}
            <SEO title={'Трифоненков В.П.'} card={'https://daily-mephi.vercel.app/api/cover'}/>

            <div className="flex-wrap w-full">
                <div className="rounded-2xl flex flex-wrap bg-white bg-opacity-90 p-6">

                    {/*<div className="font-bold text-[1.0rem] xs:text-lg w-full text-justify mx-auto mb-5 greenBox whitespace-nowrap flex justify-between max-w-[25.0rem]">*/}
                    {/*    <div>Трифоненков</div>*/}
                    {/*    <div>Владимир</div>*/}
                    {/*    <div>Петрович</div>*/}
                    {/*</div>*/}
                    <div className="font-bold text-[1.0rem] xs:text-lg w-full mx-auto mb-5 text-center whitespace-nowrap">Трифоненков Владимир Петрович</div>
                        <div className="flex flex-nowrap items-center">
                            <div className="flex items-center w-fit hidden mr-4 md:block">
                                <div className="w-fit text-[1.0rem] font-bold h-fit">
                                    <div className="flex mb-3 w-32 md:w-60">
                                        <Image
                                            src={TutorImage}
                                            alt="Tutor image"
                                            className="rounded-full z-0"
                                        />

                                    </div>
                                    <div className="flex space-x-2 items-center justify-center">
                                        <div className="rounded-full outline-black w-8 h-8
                                    border-[0.12rem] border-gray-800 font-semibold text-center pt-[0.1rem] leading-0">
                                            47
                                        </div>
                                        <div className="font-semibold">место</div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-wrap w-fit h-fit">
                                <h1 className="font-semibold">Дисциплины:</h1>
                                <div className="my-2">
                                    Теория функций копмплексных переменных, Математический анализ, Линейная алгебра,
                                    Интегральные
                                    уравнения, Дифференциальные уравнения
                                </div>

                                <div className="flex flex-wrap space-y-1 w-full pr-4 md:max-w-[10rem]">
                                    <div className="my-auto flex w-full justify-between mb-1">
                                        <div className="font-semibold">Кафедра:</div>
                                        <div>30</div>
                                    </div>
                                    <div className="my-auto flex w-full justify-between">
                                        <div className="font-semibold">Daily Mephi:</div>
                                        <div>4.5</div>
                                    </div>
                                    <div className="my-auto flex w-full justify-between">
                                        <div className="font-semibold">mephist.ru:</div>
                                        <div>2.1</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full h-[1px] bg-black my-3"/>
                        <div className="w-full space-y-1 font-semibold">
                            <RatingComponent text="Характер(4.6):"/>
                            <RatingComponent text="Преподавание(4.6):"/>
                            <RatingComponent text="Пунктуальность(4.6):"/>
                            <RatingComponent text="Прием экзаменов(4.6)"/>
                        </div>
                </div>
                <div className="w-full mt-7">
                    <Box sx={{borderBottom: 1, borderColor: 'divider', marginBottom: '1rem'}}>
                        <Tabs value={value} onChange={handleChange} variant="fullWidth"
                              TabIndicatorProps={{style: {background: 'white'}}}>
                            <Tab sx={{ minWidth: "fit-content",  maxWidth: "fit-content", padding: '0.5rem', margin: 'auto' }}
                                label={
                                <div className="flex h-8">
                                    {/*<ReviewsIconComponent src={reviewsIco}/>*/}
                                    <div
                                        className="text-black md:text-[1.4rem] xs:text-xl xxs:text-[1.0rem] text-[0.8rem] font-[Montserrat] normal-case my-auto">Отзывы
                                    </div>
                                </div>
                            } {...a11yProps(0)}
                            />
                            <Tab sx={{ minWidth: "fit-content", maxWidth: "fit-content" , padding: '0.5rem', margin: 'auto' }} label={
                                <div className="flex h-8">
                                    {/*<QuoteIconComponent src={quotesIco}/>*/}
                                    <div
                                        className="text-black md:text-[1.4rem] xs:text-xl xxs:text-[1.0rem] text-[0.8rem] font-[Montserrat] normal-case my-auto">Цитаты
                                    </div>
                                </div>
                            } {...a11yProps(1)}
                            />
                            <Tab sx={{ minWidth: "fit-content", maxWidth: "fit-content", padding: '0.5rem', margin: 'auto' }} label={
                                <div className="flex h-8">
                                    {/*<MaterialsIconComponent src={materialsIco}/>*/}
                                    <div
                                        className="text-black md:text-[1.4rem] xs:text-xl xxs:text-[1.0rem] text-[0.8rem] font-[Montserrat] normal-case my-auto">Материалы
                                    </div>
                                </div>
                            } {...a11yProps(2)}
                            />
                        </Tabs>
                    </Box>
                    {/* mt-14 */}
                    <div className="mt-6 mx-auto">
                        {value == 0 ?
                            <div className="flex-wrap space-y-10 w-full">
                                <div className="rounded-2xl p-5 text-lg w-full bg-white bg-opacity-[90%]">
                                    <UserHeaderComponent name={"User1"}
                                                         date={"15 февраля 2022"}/>
                                    <textarea
                                        className="rounded-2xl appearance-none block w-full bg-gray-200 text-gray-700
                                        border focus:border-gray-200 p-3 focus:outline-none
                                        focus:bg-gray-100 focus:border-gray-500 transition-colors h-20 mb-3 resize-none
                                        text-[0.9rem] leading-6"
                                        placeholder="Оставить отзыв"/>
                                    <div className="flex space-x-2 font-semibold">
                                        <LikeComponent/>
                                        <DislikeComponent/>
                                        <CommentComponent/>
                                    </div>
                                </div>


                                <div className="rounded-2xl p-5 text-[1.7rem] w-full bg-white bg-opacity-90">
                                    <UserHeaderComponent name={"User1"}
                                                         date={"15 февраля 2022"}/>
                                    <h1 className="font-bold text-[1.1rem] leading-6">Заголовок</h1>
                                    <div className="mb-2 text-[1.0rem] leading-5">Lorem ipsum dolor sit amet,
                                        consectetur adipisicing elit.
                                        Adipisci
                                        aut autem
                                        dolores dolorum enim esse excepturi fugit, inventore laboriosam magnam nihil
                                        officiis possimus qui recusandae repudiandae sed sequi sunt temporibus.
                                    </div>
                                    <div className="flex space-x-2 font-semibold mb-2">
                                        <LikeComponent/>
                                        <DislikeComponent/>
                                        <CommentComponent/>
                                    </div>
                                    <div className="w-full bg-black mx-auto mb-4 h-[2px]"/>
                                    <Comments/>
                                </div>
                            </div>
                            : null}
                        {value == 1 ?
                            <div className="flex-wrap space-y-10 w-full">
                                <div>

                                    <div className="rounded-2xl p-5 text-xl w-full bg-white bg-opacity-[90%]">
                                        <UserHeaderComponent name={"User1"}
                                                             date={"15 февраля 2022"}/>
                                        <div className="relative flex">
                                            <div className="h-4 w-4">
                                                <Image
                                                    src={QuoteIco}
                                                    alt="Quote symbol"
                                                />
                                            </div>
                                            <div className="italic w-[80%] mx-auto">Lorem ipsum dolor sit amet,
                                                consectetur
                                                adipisicing
                                                elit. Delectus eius laboriosam magni neque obcaecati provident rem
                                                repellendus. Consequuntur dolorem, excepturi illum iste maxime modi
                                                nesciunt
                                                pariatur, sed sunt tempora, ullam?
                                            </div>
                                            <div className="h-4 w-4 mt-auto">
                                                <Image
                                                    src={QuoteIco}
                                                    alt="Quote symbol"
                                                    className="rotate-180"
                                                />
                                            </div>
                                        </div>
                                        <div className="text-center my-2 font-semibold italic">Трифоненков В.П.</div>
                                        <div className="flex space-x-4 font-semibold">
                                            <LikeComponent/>
                                            <DislikeComponent/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            : null}
                        {value == 2 ?
                            <div className="flex-wrap space-y-10 w-full">
                                <div>
                                    <div className="rounded-2xl p-5 text-xl w-full bg-white bg-opacity-[90%]">
                                        <UserHeaderComponent name={"User1"}
                                                             date={"15 февраля 2022"}/>
                                        <h1 className="font-bold text-[1.1rem] leading-6 mt-3">Название</h1>
                                        <div className="relative flex text-[1.0rem] leading-5">

                                            <div className="">Lorem ipsum dolor sit amet, consectetur
                                                adipisicing
                                                elit. Delectus eius laboriosam magni neque obcaecati provident rem
                                                repellendus. Consequuntur dolorem, excepturi illum iste maxime modi
                                                nesciunt
                                                pariatur, sed sunt tempora, ullam?
                                            </div>

                                        </div>
                                        <div
                                            className="mt-4 mb-2 font-bold flex flex-wrap w-full text-[0.7rem] leading-4">
                                            <div
                                                className="rounded bg-[#DDD9DF] mr-2 mb-1 ml py-0.5 px-4 w-fit h-fit whitespace-nowrap">Факультет
                                            </div>
                                            <div
                                                className="rounded bg-[#F9C5D3] mr-2 mb-1 py-0.5 px-4 w-fit whitespace-nowrap">Семестр
                                                1
                                            </div>
                                            <div
                                                className="rounded bg-[#FEB3B4] mr-2 mb-1 py-0.5 px-4 w-fit whitespace-nowrap">МатАнализ
                                            </div>
                                            <div
                                                className="rounded bg-[#F4BDE6] mr-2 mb-1 py-0.5 px-4 w-fit whitespace-nowrap">Препод
                                            </div>
                                            <div
                                                className="rounded bg-[#C7A8F3] mr-2 mb-1 py-0.5 px-4 w-fit whitespace-nowrap">Экзамен
                                            </div>
                                        </div>
                                        <div
                                            className="flex flex-wrap md:flex-nowrap md:space-x-4 font-semibold relative">
                                            <div
                                                className="md:absolute md:right-0 flex space-x-4 md:mb-0 mb-2 my-auto text-[1.0rem] mt-0.5 inline-block items-center w-full md:w-fit">
                                                <div className="font-medium">exam_file_1.pdf (50 MB)</div>
                                                <div className="h-4 flex w-4 -mt-0.5">
                                                    <Image
                                                        src={DownloadIco}
                                                        alt="Comment"
                                                    />
                                                </div>

                                            </div>
                                            <div className="flex space-x-4 font-semibold w-full md:w-fit">
                                                <LikeComponent/>
                                                <DislikeComponent/>
                                                <CommentComponent/>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            : null}
                    </div>
                </div>
            </div>
        </>);

}

export default Tutor;



