import Image from "next/future/image";
import RegisterHalfCat from 'images/register_halfcat.svg'
import RegisterCat from 'images/register_cat.svg'
import CustomDialog from "./customDialog";
import RippledButton from "./rippledButton";

import {
    TextField,
    SelectChangeEvent,
    FormControl,
    NativeSelect,
} from '@mui/material';
import React from "react";

export interface DialogProps {
    opened: boolean;
    handleClose: () => void;
}


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
                        <div className="lg:text-5xl md:text-4xl text-3xl font-bold mb-3 md:mb-8 text-center">Введите имя
                        </div>
                        <FormControl
                            className="grid lg:text-3xl text-xl grid-cols-12 place-items-center focus:border-black max-w-lg  md:max-w-max mx-auto">
                            <div className="col-span-12 gap-6 md:gap-4 grid md:mb-16 mb-8 text-center md:w-fit px-8">
                                <div>Введите ник, который будет отображаться на портале</div>
                                <div className="flex flex-wrap space-y-4 md:mx-2">
                                    <TextField label="Ник"
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
                                                   }
                                               }}
                                               variant="standard" className="w-full"/>
                                    <div className="w-full border-black flex flex-wrap h-fit space-y-0">
                                        <label htmlFor="uncontrolled-native" className="ml-[1px] relative -mb-1 py-0 text-black lg:text-lg text-sm
                                         ">Курс</label>
                                        <NativeSelect
                                            sx={{
                                                "&.MuiInputBase-root:after": {
                                                    borderBottomColor: "black",
                                                }
                                            }}
                                            defaultValue="Б1"
                                            inputProps={{
                                                name: 'age',
                                                id: 'uncontrolled-native',
                                            }}
                                            className="w-full py-0 my-0 focus:bg-black lg:text-2xl text-xl"
                                        >
                                            {["Б1", "Б2", "Б3", "Б4", "С1", "С2", "С3", "С4", "С5", "М1", "М2", "А1",
                                                "А2", "А3", "А4"].map((item) =>
                                                <option value={item} key={item}>{item}</option>)}
                                        </NativeSelect>
                                    </div>
                                    {/*<StyledTextField label="Ник"*/}
                                    {/*                 variant="standard" className="w-full"/>*/}
                                </div>

                            </div>
                            <div
                                className="md:col-span-12 col-span-12 xs:w-2/3 xxs:w-3/4 w-full h-full rounded-full border-2 border-black md:w-full
                                 lg:text-3xl md:text-2xl text-xl font-bold text-center">
                                <RippledButton onClick={register}>
                                    <div>Регистрация</div>
                                </RippledButton>
                            </div>
                        </FormControl>

                    </div>
                </div>
            </div>


        </CustomDialog>
    );
}
