import React, {useEffect} from "react";
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

const Filters = dynamic(() => import("components/filters"), {ssr: true});
const FilterButtons = dynamic(() => import("components/filterButtons"), {ssr: true});

export const getStaticProps = (async () => {
    const helpers = helpersFactory();
    await helpers.utils.facilities.prefetch(undefined, {});
    await helpers.utils.disciplines.prefetch(undefined, {});
    return {props: {trpcState: helpers.dehydrate()}}
})

function Search() {
    const isMobile = useIsMobile();

    const [input, setInput] = React.useState('');

    const router = useRouter();

    const updateQueryParams = updateQueryParamsFactory(router)

    const {q: query} = router.query;

    useEffect(() => {
        setInput(query as string || '');
    }, [query]);

    async function handleEnterPress(e: any, input: string) {
        if (e.key === 'Enter') {
            updateQueryParams({q: input})
        }
        // console.log(e)
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
                                <Filters/>
                            </div> : null}
                    </div>
                </div>
            }
        </>);
}

export default Search;



