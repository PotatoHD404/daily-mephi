import * as React from 'react';
import Button from '@mui/material/Button';
import {styled} from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Image from "next/future/image";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import FileUpload from "images/file_upload.svg";
import Autocomplete from "@mui/material/Autocomplete";
import TabsBox from "./tabsBox";
import CustomDialog from "./customDialog";
import CloseButton from "./closeButton";
import TutorImg from "images/tutor.png";
import TutorImage from "../images/tutor.png";
import Box from "@mui/material/Box";
import {AccountCircle} from "@mui/icons-material";
import {InputAdornment} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import CustomSelect from "./customSelect";


const StyledTextField = styled(TextField)({
    "& label": {
        color: "gray",
        fontFamily: "Montserrat",
        marginTop: "-0.4rem",
        transition: 'all 0.2s ease',
        // fontSize: "1.0rem",
        // fontSize: "1.1rem",
        // lineHeight: "1.5rem",
        '@media (min-width:1024px)': {
            // fontSize: "1.25rem"
        }

    },
    "&:hover label": {
        fontFamily: "Montserrat",
        fontSize: "1.0rem",
    },
    "& label.Mui-focused": {
        marginTop: "0",
        fontFamily: "Montserrat",
        color: "black",
        fontSize: "1.0rem",
    },
    "& .MuiInput-underline:after": {
        borderBottomColor: "black"
    },
    "& .MuiOutlinedInput-root": {
        fontFamily: "Montserrat",
        fontSize: "1.2rem",
        "& fieldset": {
            borderColor: "black",
            borderRadius: "0.7rem",
            fontSize: "1.0rem",
        },
        "&:hover fieldset": {
            borderColor: "black",
            borderWidth: 2,
            fontSize: "1.0rem",
        },
        "&.Mui-focused fieldset": {
            borderColor: "black",
            fontSize: "1.0rem",
        }
    }
});

const StyledTextField1 = styled(TextField)({
    "& label": {
        color: "gray",
        fontFamily: "Montserrat",
        marginTop: "0.9rem",
        marginLeft: "1.9rem",

        transition: 'all 0.2s ease',
        // fontSize: "1.0rem",
        fontSize: "1.4rem",
        // lineHeight: "1.5rem",
        '@media (min-width:1024px)': {
            // fontSize: "1.25rem"
        }

    },
    "&:hover label": {
        fontFamily: "Montserrat",
        fontSize: "1.4rem",
    },
    "& label.Mui-focused": {
        marginTop: "-0.2rem",
        marginLeft: "0",
        fontFamily: "Montserrat",
        color: "black",
        fontSize: "1.0rem",
    },
    "& label.MuiFormLabel-filled": {
        marginTop: "-0.2rem",
        marginLeft: "0",
        fontFamily: "Montserrat",
        color: "black",
        fontSize: "1.0rem",
    },
    "& .MuiInput-underline:after": {
        borderBottomColor: "black"
    },
    "& .MuiOutlinedInput-root": {
        fontFamily: "Montserrat",
        fontSize: "1.2rem",
        "& fieldset": {
            borderColor: "black",
            borderRadius: "0.7rem",
            color: "black",
            fontSize: "1.4rem",
        },
        '&.Mui-focused legend': {
            // show
            textIndent: "0",
            display: "block"
        },
        '& legend': {
            // show
            textIndent: "-9999px",
        },
        '& legend:hover': {
            // show
            display: "none"
        },
        "&:hover fieldset": {
            borderColor: "black",
            borderWidth: 2,
            fontSize: "1.4rem",
        },
        "&.Mui-focused fieldset": {
            borderColor: "black",
            fontSize: "1.0rem",
        },
    },
    "& .MuiFilledInput fieldset": {
        borderColor: "black",
        fontSize: "1.0rem",
    }
});

export interface DialogProps {
    opened: boolean;
    handleClose: () => void;
}

function CustomAutocomplete(props: { options: any, label: string, className?: string }) {
    const [options, setOptions] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    // value of the autocomplete
    const [value, setValue] = React.useState<string | null>(null);

    function onChange(value: any) {
        // props.onChange(value);
        setValue(value);
        console.log(value);
        // props.value = value;
    }

    return (
        <Autocomplete
            id="country-select-demo"
            sx={{width: 350}}
            options={props.options}
            autoHighlight
            className={props.className}
            getOptionLabel={(option: any) => option.label}
            // filterOptions={(x) => x}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            renderOption={(props, option) => (
                <li className="flex" {...props}>
                    <div className="flex w-8">
                        <Image
                            src={TutorImage}
                            alt="Tutor image"
                            className="rounded-full my-auto"
                        />
                    </div>
                    <div className="ml-2 my-auto font-[Montserrat] text-[1rem]">{option.label}</div>
                </li>
            )}
            renderInput={(params) => (
                <StyledTextField1
                    {...params}
                    value={value}
                    // @ts-ignore
                    onSelect={(e) => onChange(e.target.value)}
                    label={props.label}
                    InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                            <InputAdornment position="start" className="-mt-1 -mr-0.5">
                                <div className="ml-2 flex w-7">
                                    <Image
                                        src={TutorImage}
                                        alt="Tutor image"
                                        className="rounded-full my-auto"
                                    />
                                </div>
                            </InputAdornment>
                        ),
                        autoComplete: 'new-password',
                        className: `p-0 h-[40px] ${value ? "MuiFilledInput" : ""}`
                    }}
                    // inputProps={{
                    //     ...params.inputProps,
                    //     className: "font-[Montserrat] text-xl p-0 h-[23px]",
                    //     autoComplete: 'new-password',
                    // }}


                    variant="outlined"
                    // InputProps={{classes: {input: 'font-[Montserrat] text-xl'}, sx: {height: '40px'}}}
                />
            )}
            noOptionsText="Ничего не найдено"
        />
    );
}

function Material(props: { postForm: any }) {
    const [file, setFile] = React.useState('');
    return (
        <div className="md:w-4/5 mx-auto mt-7">
            <FormControl className="w-full flex">
                <StyledTextField label="Название"
                                 variant="outlined" className="w-full mb-5"
                                 InputProps={{classes: {input: 'font-[Montserrat] text-xl'}, sx: {height: '40px'}}}/>
                <div
                    className="mb-5 font-bold flex flex-wrap w-full text-sm leading-4">
                    <div className="bg-[#DDD9DF] bg-[#F9C5D3] bg-[#FEB3B4]
             bg-[#F4BDE6] bg-[#C7A8F3] hidden"></div>
                    {[
                        {
                            color: "#DDD9DF",
                            label: "Предмет",
                            options: ["Английский язык", "Математика", "Русский язык"],
                            required: true
                        },
                        {
                            color: "#F9C5D3",
                            label: "Категория",
                            options: ["Лекции", "Семинары", "Экзамены"],
                            required: true
                        },
                        {color: "#FEB3B4", label: "Факультет", options: ["Факультет 1", "Факультет 2"]},
                        {color: "#F4BDE6", label: "Семестр", options: ["1", "2", "3", "4", "5", "6", "7", "8"]},
                        {
                            color: "#C7A8F3",
                            label: "Год",
                            options: ["2021", "2020", "2019", "2018", "2017", "2016", "2015"]
                        },
                    ].map((item, index) => (
                        <CustomSelect
                            key={index}
                            required={item.required}
                            // className={`rounded bg-[${item.color}] mr-2 mb-1 py-0.5 px-4 w-fit whitespace-nowrap`}
                            color={item.color}
                            options={item.options}
                            label={item.label}
                            index={index}
                        />

                    ))}

                </div>
                <StyledTextField label="Описание"
                                 variant="outlined" className="w-full"
                                 InputProps={{classes: {input: 'font-[Montserrat] text-xl'}, sx: {height: '15rem'}}}
                                 multiline
                                 rows={8}/>
                <div className="flex items-center justify-between mt-6">
                    <div className="flex text-center items-center">
                        <IconButton aria-label="upload picture" component="label"
                                    className="md:w-[2.5rem] md:h-[2.5rem] -ml-1 w-[2.5rem] h-[2.5rem]">
                            <input hidden accept="*" type="file"
                                   onChange={(event) =>
                                       setFile(event.target.value.split(/[\/\\]/).pop() || '')}
                            />
                            <Image src={FileUpload} alt="file upload" width={24} height={24}/>
                        </IconButton>
                        <div className="h-fit">{file}</div>
                    </div>
                    <div
                        className="rounded-full border-2 border-black w-44 h-8">
                        <Button onClick={props.postForm}
                                className="rounded-full text-black
                                            font-[Montserrat] font-bold text-center
                                             w-full normal-case h-8">
                            Отправить
                        </Button>
                    </div>
                </div>
            </FormControl>
        </div>
    );
}


function Review(props: { postForm: any }) {
    return (
        <div className="md:w-4/5 mx-auto mt-7">
            <FormControl className="w-full flex">
                <StyledTextField label="Название"
                                 variant="outlined" className="w-full mb-5"
                                 InputProps={{classes: {input: 'font-[Montserrat] text-xl'}, sx: {height: '40px'}}}/>
                <StyledTextField label="Описание"
                                 variant="outlined" className="w-full mb-1"
                                 InputProps={{classes: {input: 'font-[Montserrat] text-xl'}, sx: {height: '19.75rem'}}}
                                 multiline
                                 rows={11}/>
                <div className="flex items-center justify-end mt-6">
                    <div
                        className="rounded-full border-2 border-black w-44 h-8">
                        <Button onClick={props.postForm}
                                className="rounded-full text-black
                                            font-[Montserrat] font-bold text-center
                                             w-full normal-case h-8">
                            Отправить
                        </Button>
                    </div>
                </div>
            </FormControl>
        </div>
    );
}

function Quote(props: { postForm: any }) {
    return (
        <div className="md:w-4/5 mx-auto mt-7">
            <FormControl className="w-full flex">
                <StyledTextField label="Цитата"
                                 variant="outlined" className="w-full mb-1"
                                 InputProps={{classes: {input: 'font-[Montserrat] text-xl'}, sx: {height: '23.54rem'}}}
                                 multiline
                                 rows={12}/>
                <div className="flex items-center justify-end mt-6">
                    <div
                        className="rounded-full border-2 border-black w-44 h-8">
                        <Button onClick={props.postForm}
                                className="rounded-full text-black
                                            font-[Montserrat] font-bold text-center
                                             w-full normal-case h-8">
                            Отправить
                        </Button>
                    </div>
                </div>
            </FormControl>
        </div>
    );
}

export default function PostDialog(props: DialogProps) {
    const {handleClose, opened} = props;
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    const postForm = async () => {

    }

    return (
        <Dialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={opened}
            classes={{
                paper: "bg-white md:w-[60rem] md:h-[40rem] h-fit py-8 md:py-0 max-w-[100vw]" +
                    " md:max-w-[60rem] m-0 rounded-2xl w-[95vw] overflow-hidden px-4 md:px-0",
            }}
            fullWidth

        >

            <div className="px-2 md:px-0">
                <CloseButton onClick={handleClose}/>
                <CustomAutocomplete options={[{label: 'Трифоненков В. П.'}]} label={'Выберите преподавателя'}
                                    className="absolute top-10 md:left-[6rem]"/>
                <div className="md:mt-24 mt-12">
                    <TabsBox color={"black"} value={value} onChange={handleChange}
                             tabs={['Отзыв', 'Материал', 'Цитата']}
                             size="xl"/>
                    {value == 0 ? <Review postForm={postForm}/> : null}
                    {value == 1 ? <Material postForm={postForm}/> : null}
                    {value == 2 ? <Quote postForm={postForm}/> : null}

                </div>
            </div>
        </Dialog>
    );
}
