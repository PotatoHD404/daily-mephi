import React from "react";
import Image from "next/image";
import MiniCat from "images/minicat_transparent.svg";
import SEO from "components/seo";
import Comments from "components/comments";
import TabsBox from "components/tabsBox";
import Reactions from "components/reactions";
import TopUsers from "components/topUsers";
import useIsMobile from "lib/react/isMobileContext";

export function Post() {
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


function Tabs() {
    const [value, setValue] = React.useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    return <div className="md:w-[75%] w-[100%]">
        <TabsBox value={value} onChange={handleChange} tabs={["О нас", "Новости", "Правила"]}/>
        {value == 0 ? <Post/> : null}
        {value == 1 ? <Post/> : null}
        {value == 2 ? <Post/> : null}
    </div>;
}

function About() {
    const isMobile = useIsMobile();
    return (
        <>
            <SEO title='О нас' thumbnail={`https://daily-mephi.ru/images/thumbnails/about.png`}/>
            {isMobile == null ? null :
                <div className="flex w-full justify-between">
                    <Tabs/>
                    <TopUsers place={1} take={8} withLabel/>
                </div>
            }
        </>);

}

export default About;
