import React from "react";
import SEO from "../../components/seo";
import Image from "next/image";
import StarIcon from 'images/star.svg'

import TutorImage from "../../images/tutor.png";
import ReviewsIco from 'images/reviews.svg'
import QuotesIco from 'images/quotes.svg'
import MaterialsIco from 'images/materials.svg'
import FiltersIco from 'images/filters.svg'
import Button from "@mui/material/Button";
import Link from "next/link";

function Filters() {
    return <div className="w-[15rem] hidden md:block ml-auto">


        <div
            className="rounded-2xl pt-6 pb-4 px-3.5 text-[1.25rem] ml-auto w-[99.5%] bg-white bg-opacity-90 flex-wrap space-y-2 text-center
                    text-[#5B5959]">
            <div className="w-full">ssas</div>
            <div className="w-full">ssas</div>
            <div className="w-full">ssas</div>
            <div className="w-full">ssas</div>
            <div className="w-full">ssas</div>
            <div className="w-full">ssas</div>
            <div className="w-full">ssas</div>
            <div className="w-full">ssas</div>
            <div className="w-full">ssas</div>
            <div className="w-full">ssas</div>
            <div className="w-full">ssas</div>
            <div className="w-full">ssas</div>
            <div className="w-full">ssas</div>
            <div className="w-full">ssas</div>
            <div className="w-full">ssas</div>
            <div className="w-full">ssas</div>
        </div>
    </div>;
}

function Tutor() {
    return <Link href="/tutors/1">
        <a>
            <div className="rounded-2xl md:p-5 md:px-4 md:text-[1.7rem] text-xl w-[99.5%] bg-white bg-opacity-90 mt-4">
                <div className="flex-wrap w-full">
                    <div className="rounded-2xl flex flex-wrap bg-white bg-opacity-90 p-6 overflow-x-hidden">
                        <div className="flex justify-start items-center w-full text-lg mb-3 relative">
                            <div className="absolute right-0 top-0 md:mt-0 -mt-2 md:mr-0 -mr-2">
                                <div className="rounded-full outline-black w-8 h-8 md:w-10 md:h-10
                                    border-[0.12rem] border-gray-800 font-semibold text-center pt-[0.1rem]
                                     md:pt-[0.35rem] leading-0 text-xl md:block ">
                                    47
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 md:mx-5">
                                <div className="flex md:w-12 w-24">
                                    <Image
                                        src={TutorImage}
                                        alt="Tutor image"
                                        className="rounded-full my-auto"
                                    />
                                </div>
                                <div className="mt-4 md:mt-0">
                                    <div className="text-center h-fit">
                                        Трифоненков В. П.
                                    </div>
                                    <div
                                        className="md:hidden items-center justify-between align-middle md:mx-5 flex w-fit">
                                        <div className="mr-2">5.0</div>
                                        <div className="flex w-4 mb-[1px]">
                                            <Image
                                                src={StarIcon}
                                                alt="Tutor image"
                                                className="my-auto"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="md:flex items-center justify-between align-middle mx-5 hidden">
                                <div className="mr-2">5.0</div>
                                <div className="flex w-5 mb-[1px]">
                                    <Image
                                        src={StarIcon}
                                        alt="Tutor image"
                                        className="my-auto"
                                    />
                                </div>
                            </div>
                            <div className="flex-wrap lg:flex hidden">
                                <div className="mr-4">Отзывов: {5}</div>
                                <div className="mr-4">Материалов: {5}</div>
                                <div className="mr-4">Цитат: {5}</div>
                            </div>
                        </div>

                        <div className="flex flex-wrap w-fit h-fit md:text-xl text-[1.0rem]">

                            <div className="h-fit mb-2">
                                <span className="font-semibold h-fit">Дисциплины: </span>
                                Теория функций копмплексных переменных, Математический анализ, Линейная алгебра,
                                Интегральные
                                уравнения, Дифференциальные уравнения
                            </div>

                            <div className="flex flex-wrap space-y-1 w-full pr-4 md:max-w-[11.5rem]">
                                <div className="my-auto flex w-full justify-between mb-1 md:max-w-max max-w-[9rem]">
                                    <div className="font-semibold">Кафедра:</div>
                                    <div>30</div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap md:hidden mt-2 text-sm">
                            <div className="mr-4 mt-1">
                                <div className="flex items-center justify-between align-middle">
                                    <div className="flex w-5 mb-[1px]">
                                        <Image
                                            src={ReviewsIco}
                                            alt="Reviews ico"
                                            className="my-auto"
                                        />
                                    </div>
                                    <div className="ml-2 font-semibold">5</div>
                                    <div className="ml-3 xs:block hidden">Отзывов</div>
                                </div>
                            </div>
                            <div className="mr-4 mt-1">
                                <div className="flex items-center justify-between align-middle">
                                    <div className="flex w-5 mb-[1px]">
                                        <Image
                                            src={QuotesIco}
                                            alt="Quotes ico"
                                            className="my-auto"
                                        />
                                    </div>
                                    <div className="ml-2 font-semibold">3</div>
                                    <div className="ml-3 xs:block hidden">Цитаты</div>
                                </div>
                            </div>
                            <div className="mr-4 mt-1">
                                <div className="flex items-center justify-between align-middle">
                                    <div className="flex w-3.5 mb-[1px]">
                                        <Image
                                            src={MaterialsIco}
                                            alt="Materials ico"
                                            className="my-auto"
                                        />
                                    </div>
                                    <div className="ml-2 font-semibold">3</div>
                                    <div className="ml-3 xs:block hidden">Материала</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </a>
    </Link>;
}

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
// <Button onClick={props.postForm}
//         className="rounded-full text-black
//                                             font-[Montserrat] font-bold text-center
//                                              w-full normal-case h-8">
//     Отправить
// </Button>
function Tutors() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    return (
        <>
            <SEO title='О нас'/>

            <div className="flex flex-wrap w-full justify-center">
                <h1 className="text-2xl mb-2">Преподаватели</h1>
                <div className="md:hidden w-full mb-1 ml-2">
                    <Button className="rounded-full text-black font-[Montserrat] font-bold text-center
                                              w-fit normal-case h-8">
                        <div className="flex w-5 mb-[1px] mr-2">
                            <Image
                                src={FiltersIco}
                                alt="Filters ico"
                                className="my-auto"
                            />
                        </div>
                        <div>Фильтры</div>
                    </Button>
                </div>
                <div className="w-full h-[1px] bg-black bg-opacity-10"/>
                <div className="flex">
                    <div className="md:w-[75%] w-[100%]">
                        <Tutor/>
                        <Tutor/>
                    </div>
                    <Filters/>
                </div>
            </div>
        </>);

}

export default Tutors;



