import {styled} from "@mui/material/styles";
import {Input} from "@mui/material";
import React from "react";
import SearchIcon from "@mui/icons-material/Search";



// On enter press in search input

const StyledInput = styled(Input)(() => ({
    width: '100%',
    fontSize: '1.65rem',
    fontFamily: 'Montserrat',
    marginLeft: '0.5rem'
}));

export default function SearchBar(props: {handleEnterPress: any, input: string, setInput: any}) {
    // input state




    return <div className="bg-transparent flex border-2
                                             border-black align-middle
                                             rounded-full flex-row h-full w-[100%]">
        <SearchIcon style={{color: "black"}} className="scale-125 my-auto ml-5 mr-1"/>
        <StyledInput
            placeholder="Поиск"
            inputProps={{"aria-label": "Поиск"}}
            value={props.input}
            disableUnderline
            onKeyDown={(e: any) => props.handleEnterPress(e, props.input)}
            onChange={(e) => props.setInput(e.target.value)}
        />
    </div>;
}
