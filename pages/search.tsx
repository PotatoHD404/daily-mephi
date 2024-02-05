import React, {useCallback, useEffect} from "react";
import SEO from "components/seo";
import dynamic from "next/dynamic";
import SearchBar from "components/searchBar";
import {useRouter} from "next/router";
import Material from "components/material";
import Tutor from "components/tutor";
import useIsMobile from "lib/react/isMobileContext";
import {UserType} from "../components/userHeader";
import {updateQueryParamsFactory} from "../lib/react/updateQueryParams";
import {helpersFactory} from "../server";
import {prisma} from "../lib/database/prisma";

const Filters = dynamic(() => import("components/filters"), {ssr: true});
const FilterButtons = dynamic(() => import("components/filterButtons"), {ssr: true});

export const getStaticProps = (async () => {
    const helpers = helpersFactory();
    const [disciplines, semesters, faculties] = await Promise.all([
        helpers.utils.disciplines.fetch(),
        prisma.semester.findMany(
            {
                select: {
                    name: true,
                    materials: {
                        select: {
                            disciplines: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    name: 'asc'
                }
            }
        ).then(semesters => {
            const res: Record<string, string[]> = {}
            semesters.forEach(semester => {
                const s: Set<string> = new Set()
                semester.materials.forEach(material => material.disciplines.forEach(el => s.add(el.name)))
                res[semester.name] = [...s].sort()
            })
            return res;
        }),
        helpers.utils.faculties.fetch()]);
    return {
        props: {
            filterParams: {
                disciplines,
                faculties,
                semesters
            }
        }
    }
})

const normalizeQueryParam = (param: string | string[] | undefined): string[] => {
    if (Array.isArray(param)) {
        return param;
    } else if (param) {
        return [param];
    } else {
        return [];
    }
};

function Search({filterParams}: Awaited<ReturnType<typeof getStaticProps>>["props"]) {
    const isMobile = useIsMobile();

    const [input, setInput] = React.useState('');

    const router = useRouter();

    const updateQueryParams = updateQueryParamsFactory(router)



    const [selectedTypes, changeSelectedTypes] = React.useState<Set<string>>(new Set());
    const [selectedDisciplines, changeSelectedDisciplines] = React.useState<Set<string>>(new Set());
    const [selectedFaculties, changeSelectedFaculties] = React.useState<Set<string>>(new Set());
    const [selectedSemesters, changeSelectedSemesters] = React.useState<Set<string>>(new Set());
    const [initialized, setInitialized] = React.useState<boolean>(false);
    useEffect(() => {
        if (!initialized) {
            setInput(router.query.q as string || '');
            const types = new Set(normalizeQueryParam(router.query.types));
            const disciplines = new Set(normalizeQueryParam(router.query.disciplines));
            const faculties = new Set(normalizeQueryParam(router.query.faculties));
            const semesters = new Set(normalizeQueryParam(router.query.semesters));
            changeSelectedTypes(types);
            changeSelectedDisciplines(disciplines);
            changeSelectedFaculties(faculties);
            changeSelectedSemesters(semesters);
            setInitialized(true)
        }
    }, [initialized, router.query]);
    const changeState = useCallback(async (newInput?: string) => {
        if (initialized) {
            return updateQueryParams({
                q: newInput ?? input,
                types: [...selectedTypes],
                disciplines: [...selectedDisciplines],
                faculties: [...selectedFaculties],
                semesters: [...selectedSemesters],
            })
        }
    }, [initialized, updateQueryParams, input, selectedTypes, selectedDisciplines, selectedFaculties, selectedSemesters]);

    useEffect(() => {
        changeState();
    }, [changeState]);
    async function handleEnterPress(e: any, input: string) {
        if (e.key === 'Enter') {
            await changeState(input)
        }
    }

    const user: UserType = {
        id: "1",
        nickname: "Трифоненков В.П.",
        image: {
            url: "https://daily-mephi.ru/images/dead_cat.svg"
        },
        // legacyNickname: "User1"
    }

    return (
        <>
            <SEO title='Поиск' thumbnail={`https://daily-mephi.ru/images/thumbnails/search.png`}/>
            {isMobile == null ? null :
                <div className="flex flex-wrap w-full justify-center">
                    <h1 className="text-2xl mb-2 font-semibold">Поиск</h1>
                    {isMobile ? <FilterButtons/> : null}
                    <div className="w-full h-[1px] bg-black bg-opacity-10"/>
                    <div className="h-11 w-full md:w-[47%] mt-4 mr-auto">
                        <SearchBar
                            input={input}
                            setInput={setInput}
                            handleEnterPress={handleEnterPress}
                        />
                    </div>
                    <div className="flex">
                        <div className="md:w-[75%] w-[100%]">
                            <Tutor/>
                            <Material user={user}/>
                        </div>
                        {!isMobile ?
                            <div className="ml-auto">
                                <Filters
                                    {...filterParams}
                                    selectedTypes={selectedTypes}
                                    selectedDisciplines={selectedDisciplines}
                                    selectedFaculties={selectedFaculties}
                                    selectedSemesters={selectedSemesters}
                                    changeSelectedTypes={changeSelectedTypes}
                                    changeSelectedDisciplines={changeSelectedDisciplines}
                                    changeSelectedFaculties={changeSelectedFaculties}
                                    changeSelectedSemesters={changeSelectedSemesters}
                                />
                            </div> : null}
                    </div>
                </div>
            }
        </>);
}

export default Search;



