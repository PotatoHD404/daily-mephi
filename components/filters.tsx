import React from "react";
import Button from "@mui/material/Button";
import Image from "next/image";
import FiltersIco from "images/filters.svg";
import SortIco from "images/sort.svg";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import {styled} from "@mui/material/styles";
import CheckIcon from '@mui/icons-material/Check';
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIco from "images/search.svg";
import {ListItemButton, Slider, Drawer} from "@mui/material";
import StarIcon from "../images/star.svg";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import NewsIcon from "../images/news.svg";
import Link from "next/link";
import MaterialsIcon from "images/materials.svg";
import TutorsIcon from "images/news.svg";
import Divider from "@mui/material/Divider";


const StyledCheckbox = styled(Checkbox)(() => ({
    color: "#F591C7",
}));

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
        <AccordionDetails className="py-0">
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
        <FormGroup className="overflow-y-auto max-h-[20rem]">
            <StyledTextField label="Поиск"
                             variant="outlined" className="w-full mb-2"
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
            {props.options.map((option, index) => (
                    <FormControlLabel control={<CustomCheckbox/>}
                                      key={index}
                                      label={<div className="font-[Montserrat]">{option}</div>}/>
                )
            )}
            <div className="flex text-[0.8rem] justify-between underline mt-3">
                <div className="flex" onClick={() => setOpened(!opened)}>
                    <div className="my-auto">{opened ? "Скрыть" : "Показать всё"}</div>
                    <ExpandMoreIcon
                        className={`w-4 my-auto transition-all ease-in-out duration-200 ${opened ? "rotate-180" : ""}`}/>
                </div>
                <div className="my-auto">Сбросить</div>
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

//                                     <StyledSlider
//                                         aria-label="Temperature"
//                                         value={value}
//                                         onChange={handleChange}
//                                         valueLabelDisplay="auto"
//                                         step={0.1}
//                                         marks={marks}
//                                         min={0.5}
//                                         max={5}


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
        <div className="flex flex-wrap">
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
            {/*<div className="flex justify-between">*/}
            {/*    <div className="font-[Montserrat]">от {props.min}*/}
            {/*        <span className="font-[Montserrat]">₽</span></div>*/}
            {/*    <div className="font-[Montserrat]">до {props.max}*/}
            {/*        <span className="font-[Montserrat]">₽</span></div>*/}
            {/*</div>*/}
        </div>
    </CustomAccordion>
}

export function Filters() {
    return <div className="w-[15rem] hidden md:block ml-auto mt-4">
        <div
            className="text-[1.25rem] ml-auto w-[99.5%] px-0 whiteBox flex-wrap space-y-2 text-center text-black">
            <div className="font-bold mb-4 -mt-2">Фильтры</div>
            <SearchFilter defaultExpanded name="Факультеты" options={["ИИКС", "ФБИУКС"]}/>
            <SearchFilter defaultExpanded name="Предметы" options={["предмет", "предмет 2"]}/>
            <SliderFilter name="Оценка" min={0} max={5}/>
        </div>
    </div>;
}

function ItemsList(props: { onClick: (event: (React.KeyboardEvent | React.MouseEvent)) => void }) {
    return <Box
        sx={{width: 300}}
        role="presentation"
        onClick={props.onClick}
        onKeyDown={props.onClick}
    >
        <List>
            <ListItemButton>
                <Image src={NewsIcon} className="w-6 mr-2" alt="news"/>
                <Link href="/about"><a>О нас</a></Link>
            </ListItemButton>
            <ListItemButton>
                <Image src={MaterialsIcon} className="w-4 ml-1 mr-3" alt="materials"/>
                <Link href="/materials"><a>Материалы</a></Link>
            </ListItemButton>
            <ListItemButton>
                <Image src={TutorsIcon} className="w-6 mr-2" alt="tutors"/>
                <Link href="/tutors"><a>Преподаватели</a></Link>
            </ListItemButton>
        </List>
        <Divider/>
    </Box>;
}

function CustomButton(props: { children: React.ReactNode, onClick?: () => void}) {
    return <Button onClick={props.onClick}
        className="rounded-full text-black font-[Montserrat] font-bold text-center
                                              w-fit normal-case h-8">
        {props.children}
    </Button>;
}

export function FilterButtons() {
    // Opened filters
    const [filtersOpened, setFiltersOpened] = React.useState<boolean>(false);

    return (
        <>
            <Drawer open={filtersOpened}
                             onClose={() => setFiltersOpened(false)}
                             // onOpen={() => setFiltersOpened(true)}
                             anchor="bottom"
            className="md:hidden w-full h-[100vh]">
                <div className="h-[100vh] relative">
                    
                </div>
                {/*ItemsList({onClick: () => setFiltersOpened(false)})*/}
            </Drawer>;
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
                <CustomButton>
                    <div className="flex w-5 mb-[1px] mr-2">
                        <Image
                            src={SortIco}
                            alt="Sort ico"
                            className="my-auto"
                        />
                    </div>
                    <div>Сортировка</div>
                </CustomButton>
            </div>
        </>);
}
