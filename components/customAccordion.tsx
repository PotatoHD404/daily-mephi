import React from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {Accordion, AccordionDetails, AccordionSummary,} from "@mui/material";

export default function CustomAccordion(props: { children: React.ReactNode, name: string, defaultExpanded?: boolean }) {
    return <Accordion className="w-full"
                      defaultExpanded={props.defaultExpanded}
                      disableGutters
        // Remove all default styles
                      sx={{
                          backgroundColor: "transparent", boxShadow: "none",
                          "&:before": {display: "none"},
                      }}>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon/>}
            aria-controls="panel1a-content"
            id="panel1a-header"
            sx={{flexDirection: "row-reverse"}}
            className="-mt-2 -mb-2"
        >
            <div className="text-[1rem] font-bold">{props.name}</div>
        </AccordionSummary>
        <AccordionDetails className="p-0">
            {props.children}
        </AccordionDetails>
    </Accordion>;
}
