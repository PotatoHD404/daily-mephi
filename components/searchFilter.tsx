import React from "react";
import Image from "next/image";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIco from "images/search.svg";
import {
    FormGroup,
    FormControlLabel,
    TextField,
    InputAdornment,
    Checkbox
} from "@mui/material";
import CustomAccordion from './customAccordion'
import CheckIcon from '@mui/icons-material/Check'


function CustomCheckbox() {
    return <Checkbox
        sx={{
            // color: blue[800],

            // '&.Mui-checked': {
            //     color: "#F591C7",
            // },
        }}
        color="default"
        icon={<div className="w-[1.1rem] h-[1.1rem] border-[1.5px] m-0.5
                                             border-black rounded"/>}
        checkedIcon={
            <div className="w-[1.1rem] h-[1.1rem] border-[1.5px] m-0.5
                                             border-black rounded bg-gray-500 flex align-middle justify-center">
                <CheckIcon
                    sx={{
                        marginTop: "-2px",
                        height: "1.1rem",
                        width: "1.1rem"
                    }}
                    color="primary"/>
            </div>}
    />;
}


export default function SearchFilter(props: { name: string, options: string[], defaultExpanded?: boolean }) {
    // opened state
    const [opened, setOpened] = React.useState(false);
    return <CustomAccordion name={props.name} defaultExpanded={props.defaultExpanded}>
        <FormGroup className="md:max-h-[20rem]">
            <div className="px-3">
                <TextField label="Поиск"
                           variant="outlined" className="w-full mt-2 mb-2"
                           InputProps={{
                               endAdornment: (
                                   <InputAdornment position="end">
                                       <div className="flex w-4">
                                           <Image
                                               src={SearchIco}
                                               alt="Search ico"
                                               className="my-auto"
                                           />
                                       </div>
                                   </InputAdornment>
                               ),
                               classes: {input: 'font-[Montserrat] text-xl'}, sx: {height: '40px'}
                           }}
                           sx={{
                               "& label": {
                                   color: "gray",
                                   fontFamily: "Montserrat",
                                   marginTop: "-0.7rem",
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
                                   height: "2.0rem",
                                   "& fieldset": {
                                       borderColor: "black",
                                       borderRadius: "0.6rem",
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
                           }}
                />
            </div>

            <div
                className="overflow-y-auto overflow-x-visible flex flex-wrap px-4"> {props.options.map((option, index) => (
                    <FormControlLabel
                        className="w-full"
                        control={<CustomCheckbox/>}
                        key={index}
                        label={<div className="font-[Montserrat]">{option}</div>}/>
                )
            )}</div>

            <div className="flex text-[0.8rem] justify-between underline mt-3 px-4">
                <div className="flex cursor-pointer" onClick={() => setOpened(!opened)}>
                    <div className="my-auto select-none">{opened ? "Скрыть" : "Показать всё"}</div>
                    <ExpandMoreIcon
                        className={`w-4 my-auto transition-all ease-in-out duration-200 ${opened ? "rotate-180" : ""}`}/>
                </div>
                <div className="my-auto cursor-pointer select-none">Сбросить</div>
            </div>

        </FormGroup>
    </CustomAccordion>;
}
