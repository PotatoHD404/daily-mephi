import React from "react";
import Image from "next/image";
import FiltersIco from "images/filters.svg";
import SortIco from "images/sort.svg";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FormControlLabelProps } from "@mui/material/FormControlLabel";
import styled from "@mui/material/styles/styled";
import CheckIcon from '@mui/icons-material/Check';
import SearchIco from "images/search.svg";
import {
    Slider,
    Drawer,
    Menu,
    MenuItem,
    RadioGroup,
    Radio,
    useRadioGroup,
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    FormGroup,
    Checkbox,
    FormControlLabel,
    TextField,
    InputAdornment,
} from "@mui/material";
import StarIcon from "../images/star.svg";
import CloseButton from "./closeButton";

function CustomAccordion(props: { children: React.ReactNode, name: string, defaultExpanded?: boolean }) {
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

const StyledTextField = styled(TextField)({
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
});

function SearchFilter(props: { name: string, options: string[], defaultExpanded?: boolean }) {
    // opened state
    const [opened, setOpened] = React.useState(false);
    return <CustomAccordion name={props.name} defaultExpanded={props.defaultExpanded}>
        <FormGroup className="md:max-h-[20rem]">
            <div className="px-3">
                <StyledTextField label="Поиск"
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

const StyledSlider = styled(Slider)(() => ({
    color: '#000',
    height: 2,

    '& .MuiSlider-thumb': {
        width: 8,
        height: 8,
        transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
        '&:before': {
            boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
        },
        '&:hover, &.Mui-focusVisible': {
            boxShadow: `0px 0px 0px 8px rgb(0 0 0 / 16%)`,
        },
        '&.Mui-active': {
            width: 20,
            height: 20,
        },
    },
    '& .MuiSlider-rail': {
        opacity: 0.28,
    },
    '& .MuiSlider-markLabel': {fontFamily: 'Montserrat'},
    '& .MuiSlider-valueLabel': {
        lineHeight: 1.2,
        fontSize: 12,
        background: 'unset',
        padding: 0,
        width: 32,
        height: 32,
        borderRadius: '50% 50% 50% 0',
        backgroundColor: '#000',
        transformOrigin: 'bottom left',
        transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
        '&:before': {display: 'none'},
        '&.MuiSlider-valueLabelOpen': {
            transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
        },
        '& > *': {
            transform: 'rotate(45deg)',
        },
        fontFamily: 'Montserrat'
    }
}));

//                                     />
function SliderFilter(props: { name: string, min: number, max: number }) {
    const [value, setValue] = React.useState<number[]>([0, 5]);
    const handleChange = (event: Event, newValue: number | number[]) => {
        setValue(newValue as number[]);
    };

    function Mark(props: { value: string | number, mt?: boolean }) {
        return <div className={`${props.mt ? "-mt-2" : ""} flex`}>
            <div className="my-auto text-[0.95rem]">{props.value}</div>
            <div className="flex w-3.5 ml-0.5 my-auto">
                <Image
                    src={StarIcon}
                    alt="Tutor image"
                    className="my-auto"
                />
            </div>
        </div>;
    }

    const marks = [
        {
            value: 0,
            label: <Mark mt value={0}/>,
        },
        {
            value: 5,
            label: <Mark mt value={5}/>,
        },
    ];

    return <CustomAccordion name={props.name}>
        <div className="flex flex-wrap px-4">
            <div className="flex space-x-1 -ml-1">
                <Mark value={value[0]}/>
                <div>-</div>
                <Mark value={value[1]}/>
            </div>
            <StyledSlider
                value={value}
                // onChange={(event, newValue) => {
                //     console.log(newValue);
                // }}
                // defaultValue={[0, 2]}
                onChange={handleChange}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                getAriaValueText={(value) => `${value}₽`}
                step={0.5}
                min={props.min}
                max={props.max}
                className="mx-2 -mt-2"
                marks={marks}
            />
        </div>
    </CustomAccordion>
}

function MyFormControlLabel(props: FormControlLabelProps) {
    const radioGroup = useRadioGroup();

    let checked = false;

    if (radioGroup) {
        checked = radioGroup.value === props.value;
    }

    return <FormControlLabel checked={checked} {...props} />;
}


export function Filters() {
    return <div className="w-[15rem] hidden md:block ml-auto mt-4">
        <div
            className="text-[1.25rem] ml-auto w-[99.5%] px-0 whiteBox flex-wrap space-y-2 text-center text-black mb-4">
            <div className="font-bold mb-4 -mt-2">Сортировка</div>
            <div className="px-4">
                <RadioGroup
                    defaultValue="Популярное"
                    name="radio-buttons-group"
                >
                    {["Популярное", "Новое", "По отзывам"].map(
                        (value, index) => (
                            <MyFormControlLabel value={value}
                                                key={index}
                                                control={
                                                    <Radio sx={{
                                                        color: "black",
                                                        "&.Mui-checked": {
                                                            color: "black",
                                                        },
                                                    }}
                                                    />}
                                                label={<div className="font-[Montserrat]">{value}</div>}
                            />
                        )
                    )}
                </RadioGroup>
            </div>
        </div>
        <div
            className="text-[1.25rem] ml-auto w-[99.5%] px-0 whiteBox flex-wrap space-y-2 text-center text-black">
            <div className="font-bold mb-4 -mt-2">Фильтры</div>
            <SearchFilter defaultExpanded name="Факультеты" options={["ИИКС", "ФБИУКС"]}/>
            <SearchFilter defaultExpanded name="Предметы" options={["предмет", "предмет 2"]}/>
            <SliderFilter name="Оценка" min={0} max={5}/>
        </div>
    </div>;
}

function CustomButton(props: { children: React.ReactNode, onClick?: any }) {
    return <Button onClick={props.onClick}
                   className="rounded-full text-black font-[Montserrat] font-bold text-center
                                              w-fit normal-case h-8">
        {props.children}
    </Button>;
}

function CustomDrawer(props: { open: boolean, onClose: () => void }) {
    return <Drawer open={props.open}
                   onClose={props.onClose}
                   anchor="bottom"
                   className="md:hidden w-full h-[100vh]">
        <div className="h-[100vh] relative">
            <CloseButton onClick={props.onClose}/>
            <div className="mt-12">
                <SearchFilter defaultExpanded name="Факультеты" options={["ИИКС", "ФБИУКС"]}/>
                <SearchFilter defaultExpanded name="Предметы" options={["предмет", "предмет 2"]}/>
                <SliderFilter name="Оценка" min={0} max={5}/>
            </div>

        </div>
    </Drawer>;
}

export function FilterButtons() {
    // Opened filters
    const [filtersOpened, setFiltersOpened] = React.useState<boolean>(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    // filter state
    const [filterState, setFilterState] = React.useState("Популярное");
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <>
            <CustomDrawer open={filtersOpened} onClose={() => setFiltersOpened(false)}/>
            <div className="md:hidden w-full mb-1 ml-2 flex justify-between">
                <CustomButton onClick={() => setFiltersOpened(true)}>
                    <div className="flex w-5 mb-[1px] mr-2">
                        <Image
                            src={FiltersIco}
                            alt="Filters ico"
                            className="my-auto"
                        />
                    </div>
                    <div>Фильтры</div>
                </CustomButton>
                <CustomButton
                    onClick={handleClick}>
                    <div className="flex w-5 mb-[1px] mr-2">
                        <Image
                            src={SortIco}
                            alt="Sort ico"
                            className="my-auto"
                        />
                    </div>
                    <div>{filterState}</div>
                </CustomButton>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    {
                        ["Популярное", "Новое", "По отзывам"].map((name, index) => {
                            return <MenuItem key={index} onClick={() => {
                                handleClose();
                                setFilterState(name);
                            }}>{name}</MenuItem>
                        })
                    }
                </Menu>
            </div>
        </>
    );
}
