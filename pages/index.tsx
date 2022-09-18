import React, {useEffect} from "react";
import SEO from "components/seo";
import Image from 'next/image'
import Logo from 'images/logo.svg'
import MobileLogo from 'images/mobile_logo.svg'
import MiniCat from 'images/minicat.svg'
import {Button} from "@mui/material";
import {useRouter} from "next/router";
import dynamic from "next/dynamic";
import useIsMobile from "../helpers/react/isMobileContext";
import {useSession} from "next-auth/react";

const BuyMeACoffee = dynamic(() => import("components/buyMeCoffee"), {ssr: false});
const WarningDialog = dynamic(() => import("components/warningDialog"), {ssr: false});
const SearchBar = dynamic(() => import("components/searchBar"), {ssr: false});

export function LogoText() {
    const isMobile = useIsMobile();
    return <div className="text-[14vw] md:text-[6vw] md:-ml-1 md:-my-10 flex font-bold flex-nowrap
     w-full justify-center md:justify-start">
        {!isMobile ?
            < div className="flex h-fit w-[4vw] mt-[4vw] justify-center pl-[0.8vw] z-0">
                <Image src={MiniCat} alt="mini cat"
                       className="flex scale-95 active:scale-110 transition ease-in-out duration-300"
                    // layout="responsive"
                />

            </div> : null}

        <div className="md:-ml-[4vw] md:z-10 md:mt-1.5 md:pointer-events-none">Daily MEPhi</div>
    </div>;
}

function Home({changeNeedsAuth}: {changeNeedsAuth: (a: boolean) => void}) {

    const [state, setState] = React.useState({
        warning: false
    });
    const isMobile = useIsMobile();
    const handleClickOpenWarning = () => {
        setState({...state, warning: true});
    };
    const handleCloseWarning = () => {
        setState({...state, warning: false});
    };
    // const session = useSession();
    const [input, setInput] = React.useState('');
    // console.log(session);
    // let session = useSession();
    useEffect(() => {
        const input = document.querySelector("input");
        input?.focus();
        input?.select();

    }, []);
    const router = useRouter();
    useEffect(() => {   
        changeNeedsAuth(false);
        // window.onpopstate = () => changeNeedsAuth(true);
        }, [router.pathname]);
    async function handleEnterPress(e: any, input: string) {
        if (e.key === 'Enter') {
            // Redirect to search page with query (next.js)
            const href = `/search?q=${input}`;
            await router.push(href)
        }
        // console.log(e)
    }

    return (
        <>
            <SEO/>

            <div className="flex grid-cols-12 grid pb-12 h-auto md:pl-6 2xl:ml-0">
                <WarningDialog handleClose={handleCloseWarning} opened={state.warning}/>

                <div
                    className="flex col-start-1 md:pl-0 md:pr-0 md:col-start-1 col-end-13 content-between justify-center md:gap-4 flex-wrap md:px-5 mt-12 mb-2">
                    <div
                        className="items-center justify-start flex flex-wrap md:w-[42.8%]  my-auto justify-center">
                        <LogoText />


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
                                variant="contained" onClick={handleClickOpenWarning}>Войти на Daily MEPhi
                        </Button>
                        : null}

                    <div className="bg-white h-[1px] w-full opacity-50 md:hidden"></div>
                    {!isMobile ?
                        <div
                            className="flex justify-center md:w-[50%] my-auto max-w-xl md:max-w-max justify-center">
                            <Image src={Logo} priority alt="Big logo"/>
                        </div> :
                        <div className="h-[140vw] overflow-clip w-full flex justify-center -z-10 -mb-[40vw]">
                            <div
                                className="flex justify-center mt-[110%] scale-[275%] max-w-[40rem] justify-center h-fit">
                                <Image src={MobileLogo} priority alt="Big logo"/>
                            </div>
                        </div>}


                </div>
            </div>
            <BuyMeACoffee/>
        </>
    )

}


export default Home;
