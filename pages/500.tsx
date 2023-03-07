import SEO from "components/seo";
import React from "react";
import Image from "next/image";
import Logo from "images/cat_500.svg";
import useIsMobile from "lib/react/isMobileContext";

export default function Custom500() {
    const isMobile = useIsMobile();
    return (
        <>
            <SEO title={'Ошибка на стороне сервера'} thumbnail={`https://daily-mephi.ru/images/thumbnails/500.png`}/>
            {isMobile == null ? null :
                <div className="flex grid-cols-12 grid pb-12 h-auto md:pl-6 2xl:ml-0">

                    <div
                        className="flex col-start-1 md:pl-0 md:pr-0 md:col-start-1 col-end-13 content-between justify-center md:gap-4 flex-wrap md:px-5">
                        <div
                            className="items-center md:justify-start flex text-center flex-wrap md:w-[42.8%] mt-[8vmin] justify-center">
                            <div className="m-auto">
                                <h1 className="w-full text-[8rem] font-semibold leading-tight">500</h1>

                                <h2 className="w-full text-[3rem] font-semibold">Ошибка сервера</h2>
                            </div>
                        </div>
                        {/*<div className="bg-white h-[1px] w-full opacity-50 md:hidden"></div>*/}
                        <div
                            className="md:px-0 md:flex justify-center md:w-[50%]  mt-[4.5%] max-w-xl md:max-w-max justify-center">
                            <Image src={Logo} alt="Big logo"/>
                        </div>
                    </div>
                </div>
            }
        </>
    );
}
