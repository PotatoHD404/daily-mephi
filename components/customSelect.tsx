// import * as React from "react";
import styled from "@mui/material/styles/styled";
import NativeSelect from "@mui/material/NativeSelect";
import InputBase from "@mui/material/InputBase";
import InputLabel from "@mui/material/InputLabel";


const StyledNativeSelect = styled(NativeSelect)({
    "&.MuiInputBase-root:after": {
        borderBottomColor: "black",
    }
});

const BootstrapInput = styled(InputBase)(({theme}) => ({

    'label + &': {
        marginTop: theme.spacing(3),
    },
    '& .MuiInputBase-input': {
        height: '1.1rem',

        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.background.paper,
        border: '1px solid #ced4da',
        fontSize: 16,
        padding: '10px 26px 10px 12px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        // Use the system font instead of the default Roboto font.

        fontFamily: 'Montserrat',
        '&:focus': {
            // borderRadius: 4,
            // borderColor: '#80bdff',
            // boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
    },
}));

export default function CustomSelect(props: { options: any, label: string, defaultValue?: any, color?: string, index?: number,
    required?: boolean }) {
    return (
        <div className="relative mr-4 w-[8rem]">
            <InputLabel htmlFor={`uncontrolled-native-${props.index}`}
                        variant="standard" className={`text-black text-[1.2rem] font-[Montserrat] font-bold
                ${props.required ? "required" : ""}`}>
                {props.label}
            </InputLabel>
            <StyledNativeSelect
                defaultValue={props.defaultValue}
                id={`uncontrolled-native-${props.index}`}
                variant={"outlined"}
                input={<BootstrapInput sx={{
                    '& .MuiInputBase-input': {
                        backgroundColor: props.color,
                        paddingTop: '0.3rem',
                        paddingBottom: '0.5rem',
                    }
                }}

                />}
                className={`w-full font-semibold`}
            >
                {props.options.map((item: any) =>
                    <option className={`bg-[${props.color}] font-semibold`} value={item} key={item}>{item}</option>)}
            </StyledNativeSelect>


            {/*<Select*/}
            {/*    defaultValue={props.defaultValue}*/}
            {/*    inputProps={{*/}
            {/*        name: `age-${props.index}`,*/}
            {/*        id: `uncontrolled-native-${props.index}`,*/}
            {/*    }}*/}
            {/*    variant={"outlined"}*/}
            {/*    input={<BootstrapInput sx={{'& .MuiInputBase-input': {*/}
            {/*            backgroundColor: props.color,*/}
            {/*        }}} />}*/}
            {/*    // className={`w-full py-0 my-0 focus:bg-black lg:text-2xl text-xl ${props.className || ""}`}*/}
            {/*>*/}
            {/*    <MenuItem value="">*/}
            {/*        <em>None</em>*/}
            {/*    </MenuItem>*/}
            {/*    {props.options.map((item: any) =>*/}
            {/*        <MenuItem  value={item} key={item}>{item}</MenuItem>)}*/}
            {/*</Select>*/}
        </div>);
}
