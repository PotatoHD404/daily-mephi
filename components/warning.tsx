import * as React from 'react';
import Button from '@mui/material/Button';
import {styled} from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Image from "next/image";
import CloseIcon from 'images/close_icon.svg';
import WarningCat from 'images/warning_cat.svg'
import Link from "next/link";
import styles from "styles/warning.module.css";
import {signIn} from "next-auth/react";



const BootstrapDialog = styled(Dialog)(({theme}) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));
// w-full rounded-full flex h-12 text-3xl font-bold font-[Montserrat]
const StyledButton = styled(Button)(() => ({
    color: 'black',
    textTransform: 'none',
    width: '100%',
    borderRadius: '9999px',
    display: 'flex',
    height: '3rem',
    fontSize: '1.875rem',
    lineHeight: '2.25rem',
    fontWeight: 700,
    fontFamily: 'Montserrat'
}));

const StyledIconButton = styled(IconButton)(()=>({
    width: '3.5rem',
    height: '3.5rem',
    gridColumnStart: 13,
    gridColumnEnd: 13,
    marginTop: '1.25rem',
    marginRight: '2rem'
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
                    sx: {
                        width: '60rem',
                        height: '40.5rem',
                        borderRadius: '25px',
                    }
                }}
                fullWidth
                maxWidth='lg'
            >


                <div className="grid grid-cols-12">
                    <div className="col-start-1 col-end-6 grid mt-1 -ml-5">
                        <Image
                            src={WarningCat}
                            alt="Warning cat"
                        />
                    </div>

                    <div className="col-start-6 col-end-13">
                        <div className="grid justify-end">
                            <StyledIconButton
                                aria-label="close"
                                onClick={handleClose}
                            >
                                <Image
                                    src={CloseIcon}
                                    alt="Close icon"
                                    className="scale-90"
                                />
                            </StyledIconButton>
                        </div>

                        <div className="pl-5 mt-12 w-5/6">
                            <div className="text-5xl font-bold mb-8">Предупреждение</div>
                            <div className="grid text-3xl grid-cols-12">
                                <div className="col-span-12 gap-10 grid mb-16">
                                    <span>Авторизация происходит через home mephi.</span>
                                    <span>Ваши данные защищены.</span>
                                    <div>
                                        <span>Подробнее читайте в разделе </span>
                                        <Link href="/">
                                            <a className="underlining font-semibold">О нас</a>
                                        </Link>
                                    </div>
                                </div>
                                <div className="col-span-12 h-full rounded-full border-2 border-black">
                                    <StyledButton onClick={auth}>
                                        Продолжить
                                    </StyledButton>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>


            </BootstrapDialog>
        </>
    );
}