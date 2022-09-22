import React from "react";
import Image from "next/image";
import FiltersIco from "images/filters.svg";
import SortIco from "images/sort.svg";
import CloseButton from "./closeButton";
import {Button, Drawer, Menu, MenuItem,} from "@mui/material";
import SearchFilter from "./searchFilter";
import SliderFilter from "./sliderFilter"

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
                   className="w-full h-[100vh]">
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


export default function FilterButtons() {
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
            <div className="w-full mb-1 ml-2 flex justify-between">
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
