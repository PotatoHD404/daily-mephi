import React from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function TabsBox(props: {
    value: number, onChange: (event: React.SyntheticEvent, newValue: number) => void,
    tabs: string[]
}) {
    return <Box sx={{borderBottom: 1, borderColor: "divider", marginBottom: "1rem"}}>
        <Tabs value={props.value} onChange={props.onChange} variant="fullWidth"
              TabIndicatorProps={{style: {background: "white"},}}>
            {props.tabs.map((value, index) =>
                <Tab sx={{minWidth: "fit-content", maxWidth: "fit-content", padding: "0.5rem", margin: "auto"}}
                     key={index}
                     label={
                         <div className="flex h-8">
                             <div
                                 className="text-black md:text-[1.4rem] text-xl font-[Montserrat] normal-case my-auto">
                                 {value}
                             </div>
                         </div>
                     } {...a11yProps(index)}/>
            )
            }
        </Tabs>
    </Box>;
}
