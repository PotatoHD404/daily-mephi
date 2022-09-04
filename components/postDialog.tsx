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
import {a11yProps} from "../helpers/reactUtils";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import FileUpload from "images/file_upload.svg";

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


function Review(props: { postForm: any }) {

    return (
        <div className="md:w-4/5 mx-auto">
            <FormControl className="w-full flex">
                <StyledTextField label="Название"
                                 variant="outlined" className="w-full mb-8"
                                 InputProps={{classes: {input: 'font-[Montserrat] text-xl'}, sx: {height: '40px'}}}/>

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
                    <IconButton aria-label="upload picture" component="label"
                                className="md:w-[2.5rem] md:h-[2.5rem] -ml-1 w-[2.5rem] h-[2.5rem]">
                        <input hidden accept="*" type="file"/>
                        <Image src={FileUpload} alt="file upload" width={24} height={24}/>
                    </IconButton>

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
                    <Box sx={{borderBottom: 1, borderColor: 'divider', marginBottom: '1rem'}}>
                        <Tabs value={value} onChange={handleChange} variant="fullWidth"
                              TabIndicatorProps={{style: {background: 'gray'},}}>
                            <Tab sx={{
                                minWidth: "fit-content",
                                maxWidth: "fit-content",
                                padding: '0.5rem',
                                margin: 'auto'
                            }}
                                 label={
                                     <div className="flex h-8">
                                         <div
                                             className="text-black md:text-[1.4rem] text-xl font-[Montserrat] normal-case my-auto">Отзыв
                                         </div>
                                     </div>
                                 } {...a11yProps(0)}
                            />
                            <Tab sx={{
                                minWidth: "fit-content",
                                maxWidth: "fit-content",
                                padding: '0.5rem',
                                margin: 'auto'
                            }}
                                 label={
                                     <div className="flex h-8">
                                         <div
                                             className="text-black md:text-[1.4rem] text-xl font-[Montserrat] normal-case my-auto">Материал
                                         </div>
                                     </div>
                                 } {...a11yProps(1)}
                            />
                            <Tab sx={{
                                minWidth: "fit-content",
                                maxWidth: "fit-content",
                                padding: '0.5rem',
                                margin: 'auto'
                            }}
                                 label={
                                     <div className="flex h-8">
                                         <div
                                             className="text-black md:text-[1.4rem] text-xl font-[Montserrat] normal-case my-auto">Цитата
                                         </div>
                                     </div>
                                 } {...a11yProps(2)}
                            />
                        </Tabs>
                    </Box>
                    {value == 0 ? <Review postForm={postForm}/> : null}
                    {/*{value == 1 ? <Post/> : null}*/}
                    {/*{value == 2 ? <Post/> : null}*/}

                </div>
            </div>


        </Dialog>
    );
}
