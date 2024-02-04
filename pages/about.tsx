import React, {useEffect} from "react";
import Image from "next/image";
import MiniCat from "images/minicat_transparent.svg";
import SEO from "components/seo";
import Comments from "components/comments";
import TabsBox from "components/tabsBox";
import Reactions from "components/reactions";
import TopUsers from "components/topUsers";
import useIsMobile from "lib/react/isMobileContext";
import {useRouter} from "next/router";
import {updateQueryParamsFactory} from "../lib/react/updateQueryParams";
import {CircularProgress} from "@mui/material";
import Link from "next/link";

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

export function Info() {
    return <>
        <div className="whiteBox md:text-[1.7rem] text-xl w-[99.5%]">
            <h1 className="font-bold text-[1.2rem] leading-6">Кто мы?</h1>
            <div className="mb-2 text-[1.0rem] leading-5">
                Мы - новый студенческий портал НИЯУ МИФИ.
                Данный сайт никак не связан с руководством университета и написан силами студентов для улучшения жизни
                других студентов.
                Здесь вы можете написать честные анонимные отзывы о преподавателях или выложить учебные материалы,
                которыми смогут пользоваться другие посетители сайта.
            </div>
            <h1 className="font-bold text-[1.2rem] leading-6">Безопасность</h1>
            <div className="mb-2 text-[1.0rem] leading-5 ">Мы собираем необходимый минимум ваших данных при авторизации.
                Например, при авторизации через
                home.mephi, мы сохраняем только ваш логин в зашифрованном виде (хеш argon2 без соли, но с перцем). При
                авторизации через другие провайдеры не сохраняются никакие данные, кроме токена авторизации.
                Везде, где используется симметричное шифрование, используется AES256. Все запросы защищены протоколом
                SSL. Данные о вашей авторизации передаются посредством JWT токена.
                Если у вас остаются вопросы, как именно работает какая-либо часть кода, вы можете перейти на наш
                <Link className="ml-1 w-fit hover:underline text-blue-600"
                      href="https://github.com/PotatoHD404/daily-mephi" passHref>
                    проект
                </Link> на GitHub.
            </div>
            <h1 className="font-bold text-[1.2rem] leading-6">О стеке</h1>
            <div className="mb-2 text-[1.0rem] leading-5">Сайт написан на <Link
                className="ml-1 w-fit hover:underline text-blue-600"
                href="https://create.t3.gg/" passHref>
                T3 stack
            </Link>: <Link
                className="ml-1 w-fit hover:underline text-blue-600"
                href="https://nextjs.org/" passHref>
                Next.js
            </Link>, с использованием <Link
                className="ml-1 w-fit hover:underline text-blue-600"
                href="https://trpc.io/" passHref>
                tRPC
            </Link> для
                бекенда, <Link className="ml-1 w-fit hover:underline text-blue-600"
                               href="https://www.prisma.io/" passHref>
                    Prisma
                </Link> как ORM. В качестве базы данных используется <Link
                    className="ml-1 w-fit hover:underline text-blue-600"
                    href="https://www.cockroachlabs.com/" passHref>
                    CockroachDB
                </Link>. Хостинг предоставляет <Link
                    className="ml-1 w-fit hover:underline text-blue-600"
                    href="https://vercel.com/" passHref>
                    Vercel
                </Link>. Файлы хостятся в <Link
                    className="ml-1 w-fit hover:underline text-blue-600"
                    href="https://www.notion.so/" passHref>
                    Notion
                </Link> S3 при помощи нашего особенного решения. Всё хостится бесплатно, для того, чтобы мы могли
                поддерживать сайт как можно дольше.
            </div>
        </div>
    </>;
}

export function Rules() {
    return <>
        <div className="whiteBox md:text-[1.7rem] text-xl w-[99.5%]">
            <h1 className="font-bold text-[1.2rem] leading-6">Правила:</h1>
            <ol className="mb-2 text-[1.0rem] leading-5 list-decimal ml-5">
                <li>Выражать свои мысли культурно: не опускаться до оскорбления преподавателей или других
                    пользователей.
                </li>
                <li>Запрещено заливать в материалы любые вещи, не относящиеся напрямую к учебному процессу.</li>
                <li>На сайте возможно зарегистрироваться только действующим учащимся и сотрудникам ВУЗа через
                    home.MEPHI, поэтому для сохранения вашего аккаунта после выпуска, привязать учетную запись другого
                    интернет-источника.
                </li>
            </ol>
        </div>
    </>;
}


function Tabs() {
    const router = useRouter();

    const {queryTab} = router.query;
    const tabOk = typeof queryTab === "string" && ["0", "1", "2"].includes(queryTab);
    const updateQueryParams = updateQueryParamsFactory(router)
    const [tab, setTab] = React.useState(3);

    // console.log(queryTab, tabOk)
    useEffect(() => {
        if (!tabOk && router.isReady && tab === 3) {
            updateQueryParams({queryTab: 1})
        } else if (tabOk && router.isReady && tab === 3) {
            setTab(+queryTab);
        }
    }, [tabOk, router.isReady, queryTab, router, updateQueryParams, tab]);

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
