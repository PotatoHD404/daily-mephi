// import styled from "@mui/material/styles/styled";
import SearchIcon from "@mui/icons-material/Search";
import {Input} from '@mui/material';


// On enter press in search input

// const StyledInput = styled(Input)(() => ());

export default function SearchBar(props: { handleEnterPress: any, input: string, setInput: any }) {
    // input state


    return <div className="bg-transparent flex border-2
                                             border-black align-middle
                                             rounded-full flex-row h-full w-full">
        <SearchIcon style={{color: "black"}} className="scale-125 my-auto ml-5 mr-1"/>
        <Input
            placeholder="Поиск"
            inputProps={{"aria-label": "Поиск"}}
            value={props.input}
            disableUnderline
            onKeyDown={(e: any) => props.handleEnterPress(e, props.input)}
            onChange={(e) => props.setInput(e.target.value)}
            sx={{
                width: '100%',
                fontSize: '1.65rem',
                fontFamily: 'Montserrat',
                marginLeft: '0.5rem'
            }}
        />
    </div>;
}
