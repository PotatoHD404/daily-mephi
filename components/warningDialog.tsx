import React, {useState} from "react";
import Image from "next/image";
import WarningHalfCat from 'images/warning_halfcat.svg'
import WarningCat from 'images/warning_cat.svg'
import Link from "next/link";
import CustomDialog from "./customDialog";
import RippledButton from "./rippledButton";
import CloseButton from "./closeButton";
import {CircularProgress} from "@mui/material";
import {useRouter} from "next/router";

export interface DialogProps {
    opened: boolean;
    handleClose: () => void;
}


export default function WarningDialog(props: DialogProps) {
    const {handleClose, opened} = props;
    const [isLoading, changeIsLoading] = useState<boolean>();
    const router = useRouter();

    const auth = async () => {
        changeIsLoading(true);
        await router.push("/signin");
        handleClose()
        setTimeout(() => changeIsLoading(false), 200);
    }
    return (
        <CustomDialog onClose={!isLoading ? handleClose : () => {
        }} open={opened}>
            <div className="grid grid-cols-12 px-2 md:px-0">
                <div className="col-start-1 col-end-13 h-20 flex justify-center md:hidden">
                    <Image
                        src={WarningCat}
                        alt="Warning cat"
                    />
                </div>
                <Image
                    src={WarningHalfCat}
                    alt="Warning cat"
                    className="col-start-1 col-end-6 mt-1 hidden md:block md:h-[34.5rem] lg:h-full"
                />

                <div className="col-start-1 md:col-start-6 col-end-13">
                    <CloseButton onClick={handleClose} hidden={isLoading}/>
                    <div className="md:pl-5 md:mt-24 mt-2 md:w-5/6 text-center md:text-left">
                        <div className="lg:text-5xl md:text-4xl text-3xl font-bold mb-3 md:mb-8">Предупреждение
                        </div>

                        <div className="grid lg:text-3xl text-xl grid-cols-12 place-items-center">
                            <div className="col-span-12 gap-6 md:gap-10 grid md:mb-16 mb-8">
                                <div>Авторизация происходит через home mephi.</div>
                                <div>Ваши данные защищены.</div>
                                <div>
                                    <span>Подробнее читайте в разделе </span>
                                    <Link href="/about" className="underlining font-semibold" onClick={handleClose}>
                                        О нас
                                    </Link>
                                </div>
                            </div>
                            <div
                                className={`md:col-span-12 col-span-12 xs:w-2/3 xxs:w-3/4 w-full h-full rounded-full border-2 md:w-full
                                lg:text-3xl md:text-2xl text-xl font-bold text-center ${isLoading ? "border-gray-400" : "border-black"}`}>
                                <RippledButton onClick={auth}>
                                    {!isLoading ?
                                        <div>Продолжить</div> :
                                        <div className="flex space-x-4">
                                            <div className="my-auto">Загрузка...</div>
                                            <CircularProgress color="inherit"
                                                              thickness={3}
                                                              size={30}
                                                              className="my-auto"/>

                                        </div>}
                                </RippledButton>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </CustomDialog>
    );
}
