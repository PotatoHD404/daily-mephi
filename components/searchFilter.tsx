import React, {useState} from "react";
import Image from "next/image";
import SearchIco from "images/search.svg";
import {Checkbox, InputAdornment, styled, TextField, Tooltip, tooltipClasses, TooltipProps} from "@mui/material";
import CustomAccordion from './customAccordion'
import CheckIcon from '@mui/icons-material/Check'
import {useVirtualizer, VirtualItem} from "@tanstack/react-virtual";


function CustomCheckbox({checked, onClick}: { checked: boolean, onClick: () => void }) {
    return <Checkbox
        checked={checked}
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


const HtmlTooltip = styled(({className, ...props}: TooltipProps) =>
    (<CustomTooltip {...props} classes={{popper: className}}/>)
)(({theme}) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#ffffff',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #000000',
    },
    [`& .${tooltipClasses.arrow}`]: {
        color: theme.palette.common.white,
        "&::before": {
            backgroundColor: theme.palette.common.white,
            border: "1px solid #000000"
        }
    },
}));


function CustomTooltip({children, ...rest}: TooltipProps) {
    const [renderTooltip, setRenderTooltip] = useState(false);

    return (
        <div
            onMouseEnter={() => !renderTooltip && setRenderTooltip(true)}
            className="display-contents"
        >
            {!renderTooltip && children}
            {
                renderTooltip && (
                    <Tooltip {...rest}>
                        {children}
                    </Tooltip>
                )
            }
        </div>
    );
}


export default function SearchFilter(props: {
    name: string,
    options: string[],
    defaultExpanded?: boolean,
    selectedValues: Set<string>,
    selectChanged: (_: string) => any
}) {
    // opened state
    // const [opened, setOpened] = React.useState(false);
    const [text, setText] = React.useState('');


    const parentRef = React.useRef(null)

// The virtualizer
    const rowVirtualizer = useVirtualizer({
        count: props.options.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 35,
    })

    function rowRenderer(virtualRow: VirtualItem) {
        const option = props.options[virtualRow.index]
        // console.log(virtualRow.key)
        const onChange = () => {
            props.selectChanged(option);
        }
        return (
            <HtmlTooltip
                key={virtualRow.key}
                title={<div className="font-[Montserrat] text-md">{option}</div>}
                placement="left-start"
                arrow
            >
                <div className="hover:bg-red-100 w-full flex flex-nowrap transition ease-in-out cursor-pointer"
                     onClick={onChange}
                     style={{
                         position: 'absolute',
                         top: 0,
                         left: 0,
                         width: '100%',
                         height: `${virtualRow.size}px`,
                         transform: `translateY(${virtualRow.start}px)`,
                     }}>
                    <div className="w-fit h-fit ml-0 my-auto">
                        <CustomCheckbox onClick={onChange} checked={props.selectedValues.has(option)}/>
                    </div>
                    <div className="font-[Montserrat] truncate my-auto w-[82.5%] mx-auto py-1">{option}</div>
                </div>
            </HtmlTooltip>
        );
    }

    return <CustomAccordion name={props.name} defaultExpanded={props.defaultExpanded}>
        <div className="md:max-h-[20rem] w-full flex flex-wrap">
            <div className="px-3 flex">
                <TextField label={<div>Поиск</div>}
                           value={text}
                           onChange={(event) => setText(event.target.value)}
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
            {/* The scrollable element for your list */}
            <div
                ref={parentRef}
                className="flex flex-wrap w-full md:max-h-[14rem] overflow-y-auto text-left min-h-[7rem]"
            >
                {/* The large inner element to hold all the items */}
                <div
                    style={{
                        height: `${rowVirtualizer.getTotalSize()}px`,
                        width: '100%',
                        position: 'relative',
                    }}
                >
                    {/* Only the visible items in the virtualizer, manually positioned to be in view */}
                    {rowVirtualizer.getVirtualItems().map(rowRenderer)}
                </div>
            </div>

            <div className="flex text-[0.8rem] justify-between underline mt-3 px-4">
                {/*<div className="flex cursor-pointer" onClick={() => setOpened(!opened)}>*/}
                {/*    <div className="my-auto select-none">{opened ? "Скрыть" : "Показать всё"}</div>*/}
                {/*    <ExpandMoreIcon*/}
                {/*        className={`w-4 my-auto transition-all ease-in-out duration-200 ${opened ? "rotate-180" : ""}`}/>*/}
                {/*</div>*/}
                <div className="my-auto cursor-pointer select-none">Сбросить</div>
            </div>

        </div>
    </CustomAccordion>;
}
