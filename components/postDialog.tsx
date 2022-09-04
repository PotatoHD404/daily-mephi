import * as React from 'react';
import Button from '@mui/material/Button';
import {styled} from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Image from "next/future/image";
import CloseIcon from 'images/close_icon.svg';
import RegisterHalfCat from 'images/register_halfcat.svg'
import RegisterCat from 'images/register_cat.svg'
import Link from "next/link";
import {signIn} from "next-auth/react";
import {useEffect, useState} from "react";
import theme from "tailwindcss/defaultTheme";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";


// const BootstrapDialog = styled(Dialog)(({theme}) => ({
//     '& .MuiDialogContent-root': {
//         padding: theme.spacing(2),
//     },
//     '& .MuiDialogActions-root': {
//         padding: theme.spacing(1),
//     },
// }));

export interface DialogProps {
    opened: boolean;
    handleClose: () => void;
}

const StyledTextField = styled(TextField)({
    "& label": {
        color: "gray",
        fontFamily: "Montserrat",
        fontSize: "1.25rem",
        '@media (min-width:1024px)': {
            fontSize: "1.5rem",
        }

    },
    "&:hover label": {},
    "& label.Mui-focused": {
        color: "black"
    },
    "& .MuiInput-underline:after": {
        borderBottomColor: "black"
    },
    "& .MuiOutlinedInput-root": {
        "& fieldset": {
            borderColor: "black"
        },
        "&:hover fieldset": {
            borderColor: "black",
            borderWidth: 2
        },
        "&.Mui-focused fieldset": {
            borderColor: "black"
        }
    }
});

const StyledInputLabel = styled(InputLabel)({
    "&.Mui-focused": {
        color: "black"
    },
    "&.MuiInputLabel-root": {
        color: "gray",
    },
    "&.MuiInputLabel-root.Mui-focused": {
        color: "black"
    },
    "&.MuiInputLabel-root.MuiInputLabel-shrink": {
        color: "black"
    }
});

const StyledNativeSelect = styled(NativeSelect)({
    "&.MuiInputBase-root:after": {
        borderBottomColor: "black",
    }
});

export default function RegisterDialog(props: DialogProps) {
    const {handleClose, opened} = props;

    const [age, setAge] = React.useState('');

    const handleChange = (event: SelectChangeEvent) => {
        setAge(event.target.value);
    };
    const register = async () => {
        // await signIn('home');
        handleClose();
    }
    return (
        <Dialog
            // onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={opened}
            classes={{
                root: 'p-4',
                paper: 'bg-white md:w-[60rem] lg:h-[41rem] md:h-[35rem] h-fit py-8 md:py-0 max-w-[100vw] md:max-w-[60rem] m-0 rounded-2xl w-[95vw] overflow-hidden'
            }}
            fullWidth
        >


            <div className="grid grid-cols-12 px-2 md:px-0">
                <div className="col-start-1 col-end-13 h-20 flex justify-center md:hidden">
                    <Image
                        src={RegisterCat}
                        alt="Warning cat"
                    />
                </div>
                <Image
                    src={RegisterHalfCat}
                    alt="Warning cat"
                    className="col-start-1 col-end-6 grid mt-1 hidden md:block md:h-[34.5rem] lg:h-full"
                />

                <div className="col-start-1 md:col-start-6 col-end-13">
                    <div className="md:pl-5 md:mt-24 mt-2 md:w-5/6 text-center md:text-left">
                        <div className="lg:text-5xl md:text-4xl text-3xl font-bold mb-3 md:mb-8 text-center">Введите имя
                        </div>
                        <FormControl
                            className="grid lg:text-3xl text-xl grid-cols-12 place-items-center focus:border-black max-w-lg  md:max-w-max mx-auto">
                            <div className="col-span-12 gap-6 md:gap-4 grid md:mb-16 mb-8 text-center md:w-fit px-8">
                                <div>Введите ник, который будет отображаться на портале</div>
                                <div className="flex flex-wrap space-y-4 md:mx-2">
                                    <StyledTextField label="Ник"
                                                     variant="standard" className="w-full"/>
                                    <div className="w-full border-black flex flex-wrap h-fit space-y-0">
                                        <label htmlFor="uncontrolled-native" className="ml-[1px] relative -mb-1 py-0 text-black lg:text-lg text-sm
                                         ">Курс</label>
                                        <StyledNativeSelect
                                            defaultValue="Б1"
                                            inputProps={{
                                                name: 'age',
                                                id: 'uncontrolled-native',
                                            }}
                                            className="w-full py-0 my-0 focus:bg-black lg:text-2xl text-xl"
                                        >
                                            <option value="Б1">Б1</option>
                                            <option value="Б2">Б2</option>
                                            <option value="Б3">Б3</option>
                                            <option value="Б4">Б4</option>
                                            <option value="С1">С1</option>
                                            <option value="С2">С2</option>
                                            <option value="С3">С3</option>
                                            <option value="С4">С4</option>
                                            <option value="С5">С5</option>
                                            <option value="М1">М1</option>
                                            <option value="М2">М2</option>
                                            <option value="А1">А1</option>
                                            <option value="А2">А2</option>
                                            <option value="А3">А3</option>
                                            <option value="А4">А4</option>
                                        </StyledNativeSelect>
                                    </div>
                                    {/*<StyledTextField label="Ник"*/}
                                    {/*                 variant="standard" className="w-full"/>*/}
                                </div>

                            </div>
                            <div
                                className="md:col-span-12 col-span-12 xs:w-2/3 xxs:w-3/4 w-full h-full rounded-full border-2 border-black md:w-full">
                                <Button onClick={register}
                                        className="rounded-full text-black
                                            font-[Montserrat] font-bold text-center w-full lg:text-3xl md:text-2xl text-xl normal-case">
                                    Регистрация
                                </Button>
                            </div>
                        </FormControl>

                    </div>
                </div>
            </div>


        </Dialog>
    );
}
