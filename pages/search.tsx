import React, {useEffect} from "react";
import SEO from "components/seo";
import dynamic from "next/dynamic";
import SearchBar from "components/searchBar";
import {useRouter} from "next/router";
import Material from "components/material";
import Tutor from "components/tutor";
import useIsMobile from "lib/react/isMobileContext";
import {UserType} from "../components/userHeader";

const Filters = dynamic(() => import("components/filters"), {ssr: false});
const FilterButtons = dynamic(() => import("components/filterButtons"), {ssr: false});


function Search() {
    const isMobile = useIsMobile();
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    const [input, setInput] = React.useState('');

    const router = useRouter();
    useEffect(() => {
        setInput(router.query.q as string || '');
    }, [router.query.q]);

    async function handleEnterPress(e: any, input: string) {
        if (e.key === 'Enter') {
            const href = `/search?query=${input}`;
            await router.push(href)
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



