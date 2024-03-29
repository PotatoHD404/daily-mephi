import React, {useEffect} from "react";
import SEO from "components/seo";
import Image from 'next/image'
import Logo from 'images/logo.svg'
import MobileLogo from 'images/mobile_logo.svg'
import MiniCat from 'images/minicat.svg'
import {Button} from "@mui/material";
import {useRouter} from "next/router";
import dynamic from "next/dynamic";
import useIsMobile from "lib/react/isMobileContext";
import {useSession} from "next-auth/react";
import {Session} from "next-auth";
import {MyAppUser} from "../lib/auth/nextAuthOptions";
import {updateQueryParamsFactory} from "../lib/react/updateQueryParams";
const BuyMeACoffee = dynamic(() => import("components/buyMeCoffee"), {ssr: true});
const SearchBar = dynamic(() => import("components/searchBar"), {ssr: true});

export function LogoText() {
    const isMobile = useIsMobile();
    return <div className="text-[14vw] md:text-[6vw] md:-ml-1 md:-my-10 flex font-bold flex-nowrap
     w-full justify-center md:justify-start">
        {!isMobile ?
            <div className="flex h-fit w-[4vw] mt-[4vw] justify-center pl-[0.8vw] z-0">
                <Image src={MiniCat} alt="mini cat"
                       className="flex scale-95 active:scale-110 transition ease-in-out duration-300"
                    // layout="responsive"
                />
            </div> : null}

        <div className="md:-ml-[4vw] md:z-10 md:mt-1.5 md:pointer-events-none">Daily MEPhi</div>
    </div>;
}

function Home() {

    const isMobile = useIsMobile();
    // const session = useSession()
    const [input, setInput] = React.useState('');
    // console.log(session);
    // let session = useSession()
    useEffect(() => {
        const input = document.querySelector("input");
        input?.focus();
        input?.select();

    }, []);
    const router = useRouter();

    const handleGotoSearch = async () => {
        await router?.push('/search')
    }

    const {status} = useSession() as any as {
        data: Session & { user: MyAppUser },
        status: "authenticated" | "loading" | "unauthenticated"
    }

    const isLoading = status === "loading";
    const updateQueryParams = updateQueryParamsFactory(router)
    async function handleEnterPress(e: any, input: string) {
        if (e.key === 'Enter') {
            // Redirect to search page with query (next.js)
            await updateQueryParams({q: input}, '/search')
        }
        console.log(e)
    }

    return (
        <>
            <SEO thumbnail={`https://daily-mephi.ru/images/thumbnails/index.png`}/>
            {isMobile == null ? <h1 className="hidden">Самый
                    классный студенческий портал. Здесь вы можете оценить качества преподавателя или
                    оставить материалы для других студентов.
                </h1> :
                <>
                    <div className="grid-cols-12 grid pb-12 h-auto md:pl-6 2xl:ml-0">

                        <div
                            className="flex col-start-1 md:pl-0 md:pr-0 md:col-start-1 col-end-13 content-between justify-center md:gap-4 flex-wrap md:px-5 mt-12 mb-2">
                            <div
                                className="items-center justify-start flex flex-wrap md:w-[42.8%]  my-auto">
                                <LogoText/>


                                <h1 className="pl-5 pr-5 2xl:text-4xl lg:text-3xl md:pl-0 text-[1.4] sm:text-2xl md:flex md:mt-8 mt-3 row-start-3 row-end-4 pb-3 text-center md:text-left">Самый
                                    классный студенческий портал. Здесь вы можете оценить качества преподавателя или
                                    оставить материалы для других студентов.
                                </h1>
                                {!isMobile ?
                                    <div className="h-14 w-[80%] mr-auto mt-5">
                                        <SearchBar
                                            input={input}
                                            setInput={setInput}
                                            handleEnterPress={handleEnterPress}/>
                                    </div>
                                    : null}

                            </div>
                            {isMobile ?
                                <Button className="mb-4 shadow-none bg-white text-black font-[Montserrat] font-semibold rounded-lg
                         w-[80%] normal-case"
                                        variant="contained"
                                        disabled={isLoading}
                                        onClick={handleGotoSearch}>
                                    Поиск
                                </Button> : null}

                            <div className="bg-white h-[1px] w-full opacity-50 md:hidden"></div>
                            {!isMobile ?
                                <div
                                    className="flex justify-center md:w-[50%] my-auto max-w-xl md:max-w-max">
                                    <Image src={Logo} priority alt="Big logo"/>
                                </div> :
                                <div className="h-[140vw] overflow-clip w-full flex justify-center -z-10 -mb-[40vw]">
                                    <div
                                        className="flex justify-center mt-[110%] scale-[275%] max-w-[40rem] h-fit">
                                        <Image src={MobileLogo} priority alt="Big logo"/>
                                    </div>
                                </div>}


                        </div>
                    </div>
                    <BuyMeACoffee/>
                </>
            }
        </>
    )

}


export default Home;
