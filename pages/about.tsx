import React, {useEffect} from "react";
import Image from "next/image";
import MiniCat from "images/minicat_transparent.svg";
import SEO from "components/seo";
import Comments from "components/comments";
import TabsBox from "components/tabsBox";
import Reactions from "components/reactions";
import TopUsers from "components/topUsers";
import useIsMobile from "lib/react/isMobileContext";
import {useSession} from "next-auth/react";
import {useQuery} from "@tanstack/react-query";
import {Session} from "next-auth";
import {MyAppUser} from "../lib/auth/nextAuthOptions";
import {useRouter} from "next/router";
import {updateQueryParamsFactory} from "../lib/react/updateQueryParams";
import {CircularProgress} from "@mui/material";

export function Post() {
    console.log('Post')
    return <>
        <div className="whiteBox md:text-[1.7rem] text-xl w-[99.5%]">
            <div className="flex w-full mb-4">
                <div className="h-12 my-auto w-12">
                    <Image
                        src={MiniCat}
                        alt="Mini cat"
                    />
                </div>
                <div className="ml-2 my-auto -mt-1">
                    <div className="font-bold text-[1.0rem]">Daily MEPhi</div>
                    <div className="md:text-lg text-sm my-auto opacity-60">15 февраля 2022</div>
                </div>
            </div>
            <h1 className="font-bold text-[1.1rem] leading-6">Заголовок</h1>
            <div className="mb-2 text-[1.0rem] leading-5">Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Adipisci
                aut autem
                dolores dolorum enim esse excepturi fugit, inventore laboriosam magnam nihil
                officiis possimus qui recusandae repudiandae sed sequi sunt temporibus.
            </div>
            <Reactions likes={0} dislikes={0} comments={0} id={""} type={"news"}/>
            <div className="w-full bg-black mx-auto mb-4 h-[2px]"/>
            <Comments/>
        </div>
    </>;
}

export function Info() {
    return <>
        <div className="whiteBox md:text-[1.7rem] text-xl w-[99.5%]">
            <h1 className="font-bold text-[1.1rem] leading-6">Тут осмысленный текст о том, кто мы</h1>
            <div className="mb-2 text-[1.0rem] leading-5">Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Adipisci
                aut autem
                dolores dolorum enim esse excepturi fugit, inventore laboriosam magnam nihil
                officiis possimus qui recusandae repudiandae sed sequi sunt temporibus.
            </div>
        </div>
    </>;
}

export function Rules() {
    return <>
        <div className="whiteBox md:text-[1.7rem] text-xl w-[99.5%]">
            <h1 className="font-bold text-[1.1rem] leading-6">Тут осмысленные правила</h1>
            <div className="mb-2 text-[1.0rem] leading-5">Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Adipisci
                aut autem
                dolores dolorum enim esse excepturi fugit, inventore laboriosam magnam nihil
                officiis possimus qui recusandae repudiandae sed sequi sunt temporibus.
            </div>
        </div>
    </>;
}


function Tabs() {
    const router = useRouter();

    const {queryTab} = router.query;
    const tabOk = typeof queryTab === "string" && ["0", "1", "2"].includes(queryTab);
    const updateQueryParams = updateQueryParamsFactory(router)

    // console.log(queryTab, tabOk)
    useEffect(() => {
        if (!tabOk && router.isReady) {
            updateQueryParams({queryTab: 1})
        } else if (tabOk && router.isReady) {
            setTab(+queryTab);
        }
    }, [tabOk, router.isReady, queryTab, router, updateQueryParams]);

    const [tab, setTab] = React.useState(3);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        updateQueryParams({queryTab: newValue.toString()})
        setTab(newValue);
    };
    return <div className="md:w-[75%] w-[100%]">
        <TabsBox value={tab} onChange={handleChange} tabNames={["О нас", "Новости", "Правила"]}>
            <Info/>
            <Post/>
            <Rules/>
            <div className="md:text-[1.7rem] text-xl w-[99.5%] h-full">
                <div className="mx-auto w-fit h-fit my-auto">
                    <CircularProgress color="inherit"
                                      thickness={3}
                                      size={30}/>
                </div>
            </div>
        </TabsBox>
    </div>
        ;
}

function About() {
    const isMobile = useIsMobile();
    const {data: session, status, update: updateSession} = useSession() as unknown as {
        data: Session & { user: MyAppUser },
        status: "authenticated" | "loading" | "unauthenticated",
        // eslint-disable-next-line no-unused-vars
        update: (data?: any) => Promise<Session | null>
    };
    const [isUpdated, setIsUpdated] = React.useState(false);
    // useQuery to update session
    const {data, isFetching, refetch, isError, error} = useQuery({
        queryKey: ['session'],
        enabled: status === "authenticated" || isUpdated,
        queryFn: async () => {
            setIsUpdated(true);
            return updateSession();
        }
    });


    return (
        <>
            <SEO title='О нас' thumbnail={`https://daily-mephi.ru/images/thumbnails/about.png`}/>
            {isMobile == null ? null :
                <div className="flex w-full justify-between">
                    <Tabs/>
                    <TopUsers place={session?.user?.place ?? 1} take={8} withLabel
                              isLoading={isFetching}/>
                </div>
            }
        </>);

}

export default About;
