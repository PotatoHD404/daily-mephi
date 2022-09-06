import * as React from 'react';
import Button from '@mui/material/Button';
import {styled} from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Image from "next/future/image";
import CloseIcon from 'images/close_icon.svg';
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import FileUpload from "images/file_upload.svg";
import Autocomplete from "@mui/material/Autocomplete";
import TabsBox from "./tabsBox";

const StyledTextField = styled(TextField)({
    "& label": {
        color: "gray",
        fontFamily: "Montserrat",
        marginTop: "-0.4rem",
        transition: 'all 0.2s ease',
        // fontSize: "1.1rem",
        // lineHeight: "1.5rem",
        '@media (min-width:1024px)': {
            // fontSize: "1.25rem"
        }

    },
    "&:hover label": {
        fontFamily: "Montserrat",
    },
    "& label.Mui-focused": {
        marginTop: "0",
        fontFamily: "Montserrat",
        color: "black"
    },
    "& .MuiInput-underline:after": {
        borderBottomColor: "black"
    },
    "& .MuiOutlinedInput-root": {
        "& fieldset": {
            fontFamily: "Montserrat",
            borderColor: "black",
            borderRadius: "0.7rem"
        },
        "&:hover fieldset": {
            fontFamily: "Montserrat",
            borderColor: "black",
            borderWidth: 2
        },
        "&.Mui-focused fieldset": {
            fontFamily: "Montserrat",
            borderColor: "black"
        }
    }
});

export interface DialogProps {
    opened: boolean;
    handleClose: () => void;
}

function CustomSelect(props: { options: any, label: string, value?: any, onChange?: any }) {
    return (
        <Autocomplete
            id="country-select-demo"
            sx={{width: 300}}
            options={props.options}
            autoHighlight
            getOptionLabel={(option: any) => option.label}
            renderOption={(props, option) => (
                <li className="shrink-0">
                    {/*<img*/}
                    {/*    loading="lazy"*/}
                    {/*    width="20"*/}
                    {/*    src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}*/}
                    {/*    srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}*/}
                    {/*    alt=""*/}
                    {/*/>*/}
                    {option.label}
                </li>
            )}
            renderInput={(params) => (
                <StyledTextField
                    {...params}
                    label={props.label}
                    inputProps={{
                        ...params.inputProps,
                        autoComplete: 'new-password',
                        className: "font-[Montserrat] text-xl greenBox p-0 h-[23px]",
                    }}
                    variant="outlined"
                    // InputProps={{classes: {input: 'font-[Montserrat] text-xl'}, sx: {height: '40px'}}}
                />
            )}
        />
    );
}

function Review(props: { postForm: any }) {
    const [file, setFile] = React.useState('');
    return (
        <div className="md:w-4/5 mx-auto">
            <FormControl className="w-full flex">
                <StyledTextField label="Название"
                                 variant="outlined" className="w-full mb-8"
                                 InputProps={{classes: {input: 'font-[Montserrat] text-xl'}, sx: {height: '40px'}}}/>
                <CustomSelect options={[{label: 'Трифоненков Владимир Петрович'}]} label={'Выберите преподавателя'}/>

                <div
                    className="mt-4 mb-2 font-bold flex flex-wrap w-full text-sm leading-4">
                    <div
                        className="rounded bg-[#DDD9DF] mr-2 mb-1 ml py-0.5 px-4 w-fit h-fit whitespace-nowrap">Предмет
                    </div>
                    <div
                        className="rounded bg-[#F9C5D3] mr-2 mb-1 py-0.5 px-4 w-fit whitespace-nowrap">Категория
                    </div>
                    <div
                        className="rounded bg-[#FEB3B4] mr-2 mb-1 py-0.5 px-4 w-fit whitespace-nowrap">Факультет
                    </div>
                    <div
                        className="rounded bg-[#F4BDE6] mr-2 mb-1 py-0.5 px-4 w-fit whitespace-nowrap">Семестр
                    </div>
                    <div
                        className="rounded bg-[#C7A8F3] mr-2 mb-1 py-0.5 px-4 w-fit whitespace-nowrap">Год
                    </div>
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
                root: 'p-4',
                paper: 'bg-white md:w-[60rem] lg:h-[41rem] md:h-[35rem] h-fit py-8 md:py-0 max-w-[100vw] md:max-w-[60rem] m-0 rounded-2xl w-[95vw] overflow-hidden'
            }}
            fullWidth
        >


            <div className="px-2 md:px-0">
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
                <div className="md:mt-24 mt-2 px-6">
                    <TabsBox value={value} onChange={handleChange} tabs={['Отзыв', 'Материал', 'Цитата']}/>
                    {value == 0 ? <Review postForm={postForm}/> : null}
                    {/*{value == 1 ? <Post/> : null}*/}
                    {/*{value == 2 ? <Post/> : null}*/}

                </div>
            </div>


        </Dialog>
    );
}
