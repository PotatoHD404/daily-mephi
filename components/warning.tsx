import * as React from 'react';
import Button from '@mui/material/Button';
import {styled} from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Image from "next/image";
import CloseIcon from 'images/close_icon.svg';
import WarningHalfCat from 'images/warning_halfcat.svg'
import WarningCat from 'images/warning_cat.svg'
import Link from "next/link";
import {signIn} from "next-auth/react";
import {useEffect, useState} from "react";
import theme from "tailwindcss/defaultTheme";


const BootstrapDialog = styled(Dialog)(({theme}) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

export interface DialogProps {
    opened: boolean;
    handleClose: () => void;
}


export default function WarningDialog(props: DialogProps) {
    const {handleClose, opened} = props;

    const auth = async () => {
        await signIn('home');
        handleClose();
    }
    return (
        <>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={opened}
                PaperProps={{
                    className: 'bg-white w-[60rem] h-[40.5rem] rounded-2xl'
                }}
                fullWidth
                maxWidth='lg'
            >


                <div className="grid grid-cols-12 overflow-hidden">
                    <div className="col-start-1 col-end-13 h-20 grid mt-8 md:hidden">
                        <Image
                            src={WarningCat}
                            alt="Warning cat"
                        />
                    </div>
                    <div className="col-start-1 col-end-6 grid mt-1 hidden md:block">
                        <Image
                            src={WarningHalfCat}
                            alt="Warning cat"
                        />
                    </div>

                    <div className="col-start-1 md:col-start-6 col-end-13">
                        <IconButton
                            aria-label="close"
                            onClick={handleClose}
                            className="md:w-[3.5rem] md:h-[3.5rem] w-[2.5rem] h-[2.5rem] top-3 absolute right-3"
                        >
                            <Image
                                src={CloseIcon}
                                alt="Close icon"
                                className="scale-90"
                            />
                        </IconButton>

                        {/*<div className="pl-5 mt-12 w-5/6">*/}
                        {/*    <div className="lg:text-5xl text-4xl font-bold mb-8">Предупреждение</div>*/}
                        {/*    <div className="h-[35vh] lg: flex flex-wrap items-center mb-8 text-3xl">*/}
                        {/*        <div className="h-fit">Авторизация происходит через home mephi.</div>*/}
                        {/*        <div className="h-fit">Ваши данные защищены.</div>*/}
                        {/*        <div className="h-fit">*/}
                        {/*            <span>Подробнее читайте в разделе </span>*/}
                        {/*            <Link href="/">*/}
                        {/*                <a className="underlining font-semibold">О нас</a>*/}
                        {/*            </Link>*/}
                        {/*        </div>*/}
                        {/*        <div className="w-full rounded-full border-2 border-black">*/}
                        {/*            <StyledButton onClick={auth}>*/}
                        {/*                Продолжить*/}
                        {/*            </StyledButton>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}

                        {/*</div>*/}
                        <div className="md:pl-5 md:mt-24 mt-2 md:w-5/6 text-center md:text-left">
                            <div className="lg:text-5xl md:text-4xl text-2xl font-bold mb-4 md:mb-8">Предупреждение
                            </div>
                            <div className="grid lg:text-3xl text-2xl grid-cols-12 place-items-center">
                                <div className="col-span-12 gap-6 md:gap-10 grid md:mb-16 mb-8">
                                    <span>Авторизация происходит через home mephi.</span>
                                    <span>Ваши данные защищены.</span>
                                    <div>
                                        <span>Подробнее читайте в разделе </span>
                                        <Link href="/">
                                            <a className="underlining font-semibold">О нас</a>
                                        </Link>
                                    </div>
                                </div>
                                <div
                                    className="md:col-span-12 col-span-12 xs:w-2/3 xxs:w-3/4 w-full h-full rounded-full border-2 border-black md:w-full">
                                    <Button onClick={auth}
                                            className="rounded-full text-black
                                            font-[Montserrat] font-bold text-center w-full lg:text-3xl md:text-2xl text-xl normal-case">
                                        Продолжить
                                    </Button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>


            </BootstrapDialog>
        </>
    );
}
