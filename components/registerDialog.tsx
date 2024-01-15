import Image from "next/image";
import RegisterHalfCat from 'images/register_halfcat.svg'
import RegisterCat from 'images/register_cat.svg'
import CustomDialog from "./customDialog";
import RippledButton from "./rippledButton";

import {CircularProgress, FormControl, NativeSelect, SelectChangeEvent, TextField,} from '@mui/material';
import {ChangeEvent, useCallback, useState} from "react";
import {useQuery} from "@tanstack/react-query";

import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
// import { getCsrfToken } from 'next-auth/react';

// import {getCsrfToken} from "next-auth/react";
// @ts-ignore
// import { getCsrfToken } from 'next-auth/dist/react';
// import {cookies} from "next/headers";
import {trpc} from "../server/utils/trpc";
import {getCsrfToken, getSession} from "next-auth/react";
// import {signin} from "next-auth/core/routes";
// import fetch from "node-fetch";
// import axios from "axios";

export interface DialogProps {
    opened: boolean;
    handleClose: () => void;
}


export default function RegisterDialog(props: DialogProps) {
    const {handleClose, opened} = props;

    const [age, setAge] = useState('');

    const handleChange = (event: SelectChangeEvent) => {
        setAge(event.target.value);
    };

    const {executeRecaptcha} = useGoogleReCaptcha();
    const [name, setName] = useState<string | null>(null);
    // nickname error
    const [nicknameError, setNicknameError] = useState<string | undefined>(undefined);
    const [isFetching, setIsFetching] = useState(false);

    // const [option, setOption] = useState<string>("Не указано");

    async function handleRegister() {
        if (!executeRecaptcha) {
            return;
        }
        const recaptchaToken = await executeRecaptcha('register');
        const res = await fetch('/api/v1/users/edit', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                // csrfToken: getCsrfToken(),
                csrfToken: "",
                name,
                recaptchaToken,
                // course: option != "Не указано" ? option : undefined,
            })
        });
        if (res?.status == 200) {
            await getSession();
            location.reload();
        }
        return "ok";

    }

    // let tmp = trpc.materials.add.useMutation


    // async function register() {
    //     if (!executeRecaptcha) {
    //         return;
    //     }
    //
    //     // Nickname regex with russian letters
    //     const nicknameRegex = /^[a-zA-Z0-9_]{3,16}$/;
    //     if (name != null && nicknameRegex.test(name)) {
    //         const csrfToken = await getCsrfToken();
    //         if (!csrfToken)
    //         {
    //             throw new Error("CSRF token is not found");
    //         }
    //         const recaptchaToken = await executeRecaptcha('register');
    //         userMutation.mutate({csrfToken, recaptchaToken, nickname: name});
    //     } else {
    //         setNicknameError(true);
    //     }
    //
    //
    //     // console.log(res.redirected)
    //     // console.log(res.headers.values())
    //     // Refresh session
    //     // const
    //     // Set cookie to the session
    //     // document.cookie = `next-auth.session-token=${session}; path=/;`;
    //
    // }

    // Create a function wich returns recaptcha and csrf tokens then pass it to useQuery then pass it to useMutation,
    // do not use useCallback

    const getTokens = async () => {
        if (!executeRecaptcha) {
            throw new Error("Recaptcha is not initialized");
        }
        const csrfToken = await getCsrfToken();
        if (!csrfToken) {
            throw new Error("CSRF token is not found");
        }
        const recaptchaToken = await executeRecaptcha('register');
        return {csrfToken, recaptchaToken};
    }
    const tokensQuery = useQuery({
        queryFn: getTokens,
        queryKey: ["tokens"],
        enabled: !!executeRecaptcha
    });
    const userMutation = trpc.users.edit.useMutation();
    // Make system where we have an async query which returns whether the mutation was successful or not (call it register).
    // It should be called only after we press the button. So usecallback should not be used.
    const nicknameRegex = /^[a-zA-Z0-9_]{3,16}$/;
    const register = async () => {
        if (!tokensQuery.data) {
            return;
        }
        const {csrfToken, recaptchaToken} = tokensQuery.data;
        if (!csrfToken || !recaptchaToken) {
            return;
        }
        if (name != null && nicknameRegex.test(name)) {
            setIsFetching(true);
            await userMutation.mutateAsync({csrfToken, recaptchaToken, nickname: name}, {
                onSuccess: async () => {
                    await getSession();
                    location.reload();
                },
                onError: (error) => {
                    if (error.data?.code !== "BAD_REQUEST") {
                        setNicknameError(`Произошла ошибка, попробуйте позже, ${error.message}`)
                        return;
                    }
                    setNicknameError(error.message);
                },
                onSettled: () => {
                    tokensQuery.refetch();
                }
            })
            setIsFetching(false);
        } else {
            setNicknameError("Ник должен состоять из латинских букв, цифр и знака подчёркивания и быть длиной от 3 до 16 символов");
        }
    }


    const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
        setNicknameError(undefined);
        setName(event.target.value);
    };

    return (
        <CustomDialog onClose={undefined} open={opened}>
            <div className="grid grid-cols-12 px-2 md:px-0">
                <div className="col-start-1 col-end-13 h-20 flex justify-center md:hidden">
                    <Image
                        src={RegisterCat}
                        alt="Register cat"
                    />
                </div>
                <Image
                    src={RegisterHalfCat}
                    alt="Warning cat"
                    className="col-start-1 col-end-6 mt-1 hidden md:block md:h-[34.5rem] lg:h-full"
                />

                <div className="col-start-1 md:col-start-6 col-end-13">
                    <div className="md:pl-5 md:mt-24 mt-2 md:w-5/6 text-center md:text-left">
                        <div className="lg:text-5xl md:text-4xl text-3xl font-bold mb-3 md:mb-8 text-center">Введите
                            имя
                        </div>
                        <FormControl
                            className="grid lg:text-3xl text-xl grid-cols-12 place-items-center focus:border-black max-w-lg  md:max-w-max mx-auto">
                            <div
                                className="col-span-12 gap-6 md:gap-4 grid md:mb-16 mb-8 text-center md:w-fit px-8">
                                <div>Введите ник, который будет отображаться на портале</div>
                                <div className="flex flex-wrap space-y-4 md:mx-2">
                                    <TextField
                                        helperText={nicknameError}
                                        error={nicknameError !== undefined}
                                        value={name}
                                        onChange={handleTextChange}
                                        label="Ник"
                                        autoComplete="off"
                                        sx={{
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
                                            },
                                            "& .MuiInputBase-root": {
                                                height: "2.5rem",
                                                fontFamily: "Montserrat",
                                                fontSize: "1.25rem",
                                                '@media (min-width:1024px)': {
                                                    fontSize: "1.5rem",
                                                    // paddingBottom: "0.5rem"
                                                }
                                            }
                                        }}
                                        variant="standard" className="w-full"/>
                                    {/*<div className="w-full border-black flex flex-wrap h-fit space-y-0">*/}
                                    {/*    <label htmlFor="uncontrolled-native" className="ml-[1px] relative -mb-1 py-0 text-black lg:text-lg text-sm*/}
                                    {/*     ">Курс</label>*/}
                                    {/*    <NativeSelect*/}
                                    {/*        value={option}*/}
                                    {/*        onChange={(event) => setOption(event.target.value)}*/}
                                    {/*        sx={{*/}
                                    {/*            "&.MuiInputBase-root:after": {*/}
                                    {/*                borderBottomColor: "black",*/}
                                    {/*            }*/}
                                    {/*        }}*/}
                                    {/*        defaultValue="Не указано"*/}
                                    {/*        inputProps={{*/}
                                    {/*            name: 'age',*/}
                                    {/*            id: 'uncontrolled-native',*/}
                                    {/*        }}*/}
                                    {/*        className="w-full py-0 my-0 focus:bg-black lg:text-2xl text-xl"*/}
                                    {/*    >*/}
                                    {/*        {["Не указано", "Б1", "Б2", "Б3", "Б4", "С1", "С2", "С3", "С4", "С5", "М1", "М2", "А1",*/}
                                    {/*            "А2", "А3", "А4"].map((item) =>*/}
                                    {/*            <option value={item} key={item}>{item}</option>)}*/}
                                    {/*    </NativeSelect>*/}
                                    {/*</div>*/}
                                </div>

                            </div>
                            <div className={`md:col-span-12 col-span-12 xs:w-2/3 xxs:w-3/4 w-full h-full
                             rounded-full border-2 md:w-full lg:text-3xl md:text-2xl text-xl font-bold
                              text-center ${isFetching ? "border-gray-400" : "border-black"}`}>
                                <RippledButton onClick={register} disabled={isFetching}>
                                    {!isFetching ?
                                        <div>Регистрация</div> :
                                        <div className="flex space-x-4">
                                            <div className="my-auto">Загрузка...</div>
                                            <CircularProgress color="inherit"
                                                              thickness={3}
                                                              size={30}
                                                              className="my-auto"/>

                                        </div>}
                                </RippledButton>
                            </div>
                        </FormControl>
                    </div>
                </div>
            </div>

        </CustomDialog>
    );
}
