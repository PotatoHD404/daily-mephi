import React from "react";
import {FormControlLabelProps} from "@mui/material/FormControlLabel";
import SearchFilter from "./searchFilter";
import {FormControlLabel, Radio, RadioGroup, useRadioGroup,} from "@mui/material";
import SliderFilter from "./sliderFilter";
import RippledButton from "./rippledButton";
import {trpc} from "../server/utils/trpc";

function MyFormControlLabel(props: FormControlLabelProps) {
    const radioGroup = useRadioGroup();

    let checked = false;

    if (radioGroup) {
        checked = radioGroup.value === props.value;
    }

    return <FormControlLabel checked={checked} {...props} />;
}


export default function Filters() {

    const {data, isFetching} = trpc.utils.faculties.useQuery(undefined,{
        // enabled: !props.isLoading
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false
    });
    const {data: data1, isFetching: isFetching1} = trpc.utils.disciplines.useQuery(undefined,{
        // enabled: !props.isLoading
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false
    });

    const faculties = data ?? []
    const disciplines = data1 ?? []

    return <div className="w-[15rem] ml-auto mt-4 pl-1">
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
            <SearchFilter defaultExpanded name="Факультеты" options={faculties}  selectChanged={() => {}} selectedValues={[]}/>
            <SearchFilter defaultExpanded name="Предметы" options={disciplines}  selectChanged={() => {}} selectedValues={[]}/>
            <SliderFilter defaultExpanded name="Оценка" min={0} max={5}/>
            <RippledButton  className="rounded-full mx-auto w-4/5 p-1 shadow-sm bg-red-200" onClick={() => null}>
                <div>Применить</div>
            </RippledButton>
        </div>
    </div>;
}
