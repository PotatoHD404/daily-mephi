import Image from "next/future/image";
import RegisterHalfCat from 'images/register_halfcat.svg'
import RegisterCat from 'images/register_cat.svg'
import CustomDialog from "./customDialog";
import RippledButton from "./rippledButton";

import {
    TextField,
    SelectChangeEvent,
    FormControl,
    NativeSelect, CircularProgress,
} from '@mui/material';
import {ChangeEvent, useEffect, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {signIn, useSession} from "next-auth/react";
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
    const [name, setName] = useState<string | null>(null);
    // nickname error
    const [nicknameError, setNicknameError] = useState<boolean>(false);
    const [option, setOption] = useState<string>("Не указано");
    async function handleRegister() {
        const res = await fetch('/api/v1/users/edit', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                name,
                course: option != "Не указано" ? option : undefined,
            })
        });
        if (res?.status == 200) {
            const res1 = await fetch('/api/auth/session/renew_jwt', {
                method: 'GET',
                credentials: 'same-origin',
            });
            if(res1.status == 200) {
                location.reload();
            }
        }
        return "ok";

    }

    const {data, refetch: fetchRegister, isFetching, isError} = useQuery(['register'], handleRegister, {
        refetchOnWindowFocus: false,
        enabled: false // disable this query from automatically running
    });

    const register = async () => {
        // Nickname regex with russian letters
        const nicknameRegex = /^[a-zA-Z0-9_]{3,16}$/;
        if (name != null && nicknameRegex.test(name)) {
            await fetchRegister();
        } else {
            setNicknameError(true);
        }
 
            
            // console.log(res.redirected)
            // console.log(res.headers.values())
            // Refresh session
            // const 
            // // Set cookie to the session
            // document.cookie = `next-auth.session-token=${session}; path=/;`;
        
    }
    // useEffect(() => {
    //     if (!isError && !nicknameError && data?.status == 200 && document?.cookie) {
    //         axios('/api/auth/session/renew_jwt', { withCredentials: true 
    //         }).then(async (res) => {
    //             console.log(res.headers["Set-Cookie"])
    //         })
    //         // console.log(res.headers.values())
    //         // Refresh session
    //         // const 
    //         // // Set cookie to the session
    //         // document.cookie = `next-auth.session-token=${session}; path=/;`;

    //         // handleClose();
    //     }
    // }, [isFetching, isError, document?.cookie, data?.status])
    

    const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
        setNicknameError(false);
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
                    className="col-start-1 col-end-6 grid mt-1 hidden md:block md:h-[34.5rem] lg:h-full"
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
                                        helperText={nicknameError ? "Ник может состоять только из латиницы, цифр и _, длина от 3 до 16 символов" : undefined}
                                        error={nicknameError}
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
                                    <div className="w-full border-black flex flex-wrap h-fit space-y-0">
                                        <label htmlFor="uncontrolled-native" className="ml-[1px] relative -mb-1 py-0 text-black lg:text-lg text-sm
                                         ">Курс</label>
                                        <NativeSelect
                                            value={option}
                                            onChange={(event) => setOption(event.target.value)}
                                            sx={{
                                                "&.MuiInputBase-root:after": {
                                                    borderBottomColor: "black",
                                                }
                                            }}
                                            defaultValue="Не указано"
                                            inputProps={{
                                                name: 'age',
                                                id: 'uncontrolled-native',
                                            }}
                                            className="w-full py-0 my-0 focus:bg-black lg:text-2xl text-xl"
                                        >
                                            {["Не указано", "Б1", "Б2", "Б3", "Б4", "С1", "С2", "С3", "С4", "С5", "М1", "М2", "А1",
                                                "А2", "А3", "А4"].map((item) =>
                                                <option value={item} key={item}>{item}</option>)}
                                        </NativeSelect>
                                    </div>
                                    {/*<StyledTextField label="Ник"*/}
                                    {/*                 variant="standard" className="w-full"/>*/}
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
