import React, {useMemo} from "react";
import {Box, Tab, Tabs} from '@mui/material';

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


export default function TabsBox(props: {
    value: number,
    onChange: (event: React.SyntheticEvent, newValue: number) => void,
    tabNames: string[],
    color?: string,
    size?: string,
    children?: (React.JSX.Element)[]
}) {
    // console.log(props.value)
    const tabContents = useMemo(() => props.children, [props.children]);
    return (
        <Box sx={{borderBottom: 1, borderColor: "divider"}}>
            <Tabs value={props.value} onChange={props.onChange} variant="fullWidth"
                  TabIndicatorProps={{style: {background: props.color || "white"},}}>
                {props.tabNames.map((value, index) =>
                    <Tab sx={{
                        minWidth: "fit-content",
                        maxWidth: "fit-content",
                        padding: "0.5rem",
                        margin: "auto"
                    }}
                         key={index}
                         label={
                             <div className="flex h-8">
                                 <div
                                     className={`text-black md:text-${props.size || "2xl"}
                                  text-xl font-[Montserrat] normal-case my-auto`}>
                                     {value}
                                 </div>
                             </div>
                         } {...a11yProps(index)}/>
                )
                }
            </Tabs>
            <div className="mt-[1.1rem]">
                {tabContents?.map((el, index) => {
                    return (
                        <div
                            role="tabpanel"
                            id={`simple-tabpanel-${index}`}
                            aria-labelledby={`simple-tab-${index}`}
                            key={index}
                        >
                            {props.value === index && el}
                        </div>
                    )
                })}
            </div>

        </Box>
    )
}
