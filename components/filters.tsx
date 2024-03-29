import React from "react";
// import {FormControlLabelProps} from "@mui/material/FormControlLabel";
import SearchFilter from "./searchFilter";
// import {FormControlLabel, useRadioGroup,} from "@mui/material";
import SliderFilter from "./sliderFilter";
import RippledButton from "./rippledButton";
import {ChangeStateType} from "../pages/search";

// function MyFormControlLabel(props: FormControlLabelProps) {
//     const radioGroup = useRadioGroup();
//
//     let checked = false;
//
//     if (radioGroup) {
//         checked = radioGroup.value === props.value;
//     }
//
//     return <FormControlLabel checked={checked} {...props} />;
// }

function changeSet(set: Set<string>, el: string) {
    const newSet = new Set(set);
    if (newSet.has(el)) {
        newSet.delete(el)
    } else {
        newSet.add(el)
    }
    return newSet;
}

interface FiltersType {
    selectedTypes: Set<string>
    changeSelectedTypes: React.Dispatch<React.SetStateAction<Set<string>>>
    selectedDisciplines: Set<string>
    changeSelectedDisciplines: React.Dispatch<React.SetStateAction<Set<string>>>
    selectedFaculties: Set<string>
    changeSelectedFaculties: React.Dispatch<React.SetStateAction<Set<string>>>
    selectedSemesters: Set<string>
    changeSelectedSemesters: React.Dispatch<React.SetStateAction<Set<string>>>
    faculties: string[],
    disciplines: string[],
    semesters: Record<string, string[]>
    changeState: (_: ChangeStateType) => any
    search: () => any
}

export default function Filters({
                                    selectedTypes,
                                    changeSelectedTypes,
                                    selectedDisciplines,
                                    changeSelectedDisciplines,
                                    selectedFaculties,
                                    changeSelectedFaculties,
                                    selectedSemesters,
                                    changeSelectedSemesters,
                                    faculties,
                                    disciplines,
                                    semesters,
                                    changeState,
                                    search
                                }: FiltersType) {


    return <div className="w-[15rem] ml-auto mt-4 pl-1">
        {/*<div*/}
        {/*    className="text-[1.25rem] ml-auto w-[99.5%] px-0 whiteBox flex-wrap space-y-2 text-center text-black mb-4">*/}
        {/*    <div className="font-bold mb-4 -mt-2">Сортировка</div>*/}
        {/*    <div className="px-4">*/}
        {/*        <RadioGroup*/}
        {/*            defaultValue="Популярное"*/}
        {/*            name="radio-buttons-group"*/}
        {/*        >*/}
        {/*            {["Популярное", "Новое", "По отзывам"].map(*/}
        {/*                (value, index) => (*/}
        {/*                    <MyFormControlLabel value={value}*/}
        {/*                                        key={index}*/}
        {/*                                        control={*/}
        {/*                                            <Radio sx={{*/}
        {/*                                                color: "black",*/}
        {/*                                                "&.Mui-checked": {*/}
        {/*                                                    color: "black",*/}
        {/*                                                },*/}
        {/*                                            }}*/}
        {/*                                            />}*/}
        {/*                                        label={<div className="font-[Montserrat]">{value}</div>}*/}
        {/*                    />*/}
        {/*                )*/}
        {/*            )}*/}
        {/*        </RadioGroup>*/}
        {/*    </div>*/}
        {/*</div>*/}
        <div className="text-[1.25rem] ml-auto w-[99.5%] px-0 whiteBox flex-wrap space-y-2 text-center text-black">
            <div className="font-bold mb-4 -mt-2">Фильтры</div>
            <SearchFilter defaultExpanded name="Тип" options={['Преподаватель', 'Материал', 'Цитата']}
                          selectChanged={(el) => {
                              const newTypes = changeSet(selectedTypes, el);
                              changeSelectedTypes(newTypes)
                              changeState({types: [...newTypes]})
                          }} selectedValues={selectedTypes}/>
            <SearchFilter defaultExpanded name="Предметы" options={disciplines}
                          selectChanged={(el) => {
                              const newDisciplines = changeSet(selectedDisciplines, el);
                              changeSelectedDisciplines(newDisciplines)
                              changeState({disciplines: [...newDisciplines]})
                          }} selectedValues={selectedDisciplines}/>
            <SearchFilter defaultExpanded name="Семестры" options={Object.keys(semesters)}
                          selectChanged={(el) => {
                              const newFaculties = changeSet(selectedFaculties, el);
                              changeSelectedFaculties(newFaculties)
                              changeState({faculties: [...newFaculties]})
                          }} selectedValues={selectedFaculties}/>
            <SearchFilter name="Факультеты" options={faculties}
                          selectChanged={(el) => {
                              const newSemesters = changeSet(selectedSemesters, el);
                              changeSelectedSemesters(newSemesters)
                              changeState({semesters: [...newSemesters]})
                          }} selectedValues={selectedSemesters}/>
            <SliderFilter defaultExpanded name="Оценка" min={0} max={5}/>
            <RippledButton className="rounded-full mx-auto w-4/5 p-1 shadow-sm bg-red-200" onClick={search}>
                <div>Применить</div>
            </RippledButton>
        </div>
    </div>;
}
