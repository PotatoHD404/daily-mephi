// import * as React from "react";
import {NativeSelect, InputBase, InputLabel} from '@mui/material';

export default function CustomSelect(props: {
    options: any, label: string, defaultValue?: any, color?: string, index?: number,
    required?: boolean
}) {
    return (
        <div className="relative mr-4 w-[8rem]">
            <InputLabel htmlFor={`uncontrolled-native-${props.index}`}
                        variant="standard" className={`text-black text-[1.2rem] font-[Montserrat] font-bold
                ${props.required ? "required" : ""}`}>
                {props.label}
            </InputLabel>
            <NativeSelect
                defaultValue={props.defaultValue}
                id={`uncontrolled-native-${props.index}`}
                variant={"outlined"}
                input={<InputBase sx={{
                    "&.MuiInputBase-root:after": {
                        borderBottomColor: "black",
                    },
                    'label + &': {
                        marginTop: '3px',
                    },
                    '& .MuiInputBase-input': {
                        height: '1.1rem',

                        borderRadius: 4,
                        position: 'relative',
                        border: '1px solid #ced4da',
                        fontSize: 16,
                        padding: '10px 26px 10px 12px',
                        transition: 'border-color box-shadow 0.3s ease-in-out',
                        backgroundColor: props.color,
                        paddingTop: '0.3rem',
                        paddingBottom: '0.5rem',
                        fontFamily: 'Montserrat',
                        '&:focus': {
                            // borderRadius: 4,
                            // borderColor: '#80bdff',
                            // boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
                        },
                    }
                }}
                />}
                className="w-full font-semibold"
            >
                {props.options.map((item: any) =>
                    <option className={`bg-[${props.color}] font-semibold`} value={item} key={item}>{item}</option>)}
            </NativeSelect>


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
