/*  ./components/Navbar.jsx     */
import Link from 'next/link';
import React, {useEffect, useState} from 'react';
import NewsIcon from "images/news.svg";
import MaterialsIcon from "images/materials.svg";
import TutorsIcon from "images/tutors.svg";
import UsersIcon from "images/users.svg";

const List = dynamic(() => import("@mui/material/List"), {ssr: true});
const ListItemButton = dynamic(() => import("@mui/material/ListItemButton"), {ssr: true});
const SwappableDrawer = dynamic(() => import("@mui/material/SwipeableDrawer"), {ssr: true});
const WarningDialog = dynamic(() => import("components/warningDialog"), {ssr: true});
const Minicat = dynamic(() => import("components/minicat"), {ssr: true});
const RegisterDialog = dynamic(() => import("./registerDialog"), {ssr: true});
import {useRouter} from "next/router";
import Image from "next/future/image";
import burger from 'images/burger.svg'
import {getSession, signOut, useSession} from "next-auth/react";
import MiniCat from "images/minicat.svg";
import style from "styles/navbar.module.css";
import useMediaQuery from "helpers/react/useMediaQuery";
import dynamic from "next/dynamic";


import {Box, Divider, Button, IconButton} from '@mui/material';
import {toChildArray} from "preact";


interface DefaultNavbarParams {
    handleClickOpenWarning: () => void;
    toggleDrawer: () => void;
}


function DefaultNavbar(props: DefaultNavbarParams) {
    const isMobile = useMediaQuery(768);
    return <nav className="grid-cols-12 grid text-[1.65rem] md:h-[5.5rem] w-full content-center mx-auto rounded-b-lg md:rounded-b-2xl flex
                     justify-between align-middle bg-white bg-opacity-[36%] md:px-8 max-w-[1280px]">
        {!isMobile ?
            <div className="flex col-start-1 col-end-13 justify-between">


                <Link href="/">
                    <a className="flex h-14 my-auto w-14 mb-2 -mt-2">
                        <Minicat/>
                    </a>
                </Link>


                <Link href="/about">
                    <a className="underlining my-auto"><h3>О нас</h3></a>
                </Link>

                <Link href="/materials">
                    <a className="underlining my-auto"><h3>Материалы</h3></a>
                </Link>

                <Link href="/tutors">
                    <a className="underlining my-auto"><h3>Преподаватели</h3></a>
                </Link>
                <div className="mt-2">
                    <AuthSection {...props}/>
                </div>
            </div>
            :
            <div className="col-start-1 col-end-13"><MobileNavbar onClick={props.toggleDrawer}/></div>
        }

    </nav>;
}

function AuthSection(props: DefaultNavbarParams) {
    // const router = useRouter()
    const isMobile = useMediaQuery(768);
    const {data: session, status} = useSession()
    const [open, setOpen] = useState(false)


    useEffect(() => {
        // console.log("Auth section rerendered")
        if (session?.user && session.user.name === null) {
            // setOpen(true);

            // router.push('/users/new')


        }
    }, [status, session?.user])

    // export async function getInitialProps(context: any) {
    //     const session = await getSession(context)
    //     console.log(session)
    //     if (session?.user === null) {
    //         return {
    //             redirect: {
    //                 destination: '/users/new',
    //                 permanent: false,
    //             },
    //         }
    //     }
    //
    //     return {
    //         props: { session }
    //     }
    // }

    if (status === "loading") {
        return (
            !isMobile ?
                <div
                    className={`${style.authText}`}>
                    <h3 className="underlining">Загрузка...</h3>
                </div> : null
        )
    } else if (status === "unauthenticated" || !session) {
        return (
            !isMobile ?
                <button onClick={props.handleClickOpenWarning}
                        className={`${style.authText}`}>
                    <h3 className="underlining">Войти</h3>
                </button> : null
        )
    } else {
        return (
            <>
                <RegisterDialog
                    handleClose={() => setOpen(false)}
                    opened={open}/>

                {!isMobile ? <button
                    className={`${style.authText}`}>
                    <h3 className="underlining">{session.user?.name || "Профиль"}</h3>
                </button> : null}
            </>
        )
    }
}

// function CustomButton(props: { children: React.ReactNode, onClick: () => void }) {
//     // @ts-ignore
//     return <Button className="rounded-full text-black font-[Montserrat] font-bold text-center
//                                               w-[1px] normal-case h-8"
//                    onClick={props.onClick()}>
//         {props.children}
//     </Button>;
// }

function MobileNavbar(props: { onClick: () => void, home?: boolean }) {
    return <div className="w-full">
        <div className={"flex justify-between h-12 pl-5 pr-5 items-center " + (props.home ? "mt-2" : "")}>
            {/* @ts-ignore */}
            <IconButton
                aria-label="close"
                onClick={props.onClick()}
                className="md:w-[3.5rem] md:h-[3.5rem] w-[2.5rem] h-[2.5rem]"
            >
                <Image className="flex" src={burger} alt="burger"/>
            </IconButton>
            <Link href="/">
                <Button className="flex h-full w-11 rounded-full">
                    <Image src={MiniCat} alt="mini cat"
                           className="flex"
                        // layout="responsive"
                    />

                </Button>
            </Link>
        </div>
        <AuthSection handleClickOpenWarning={() => {
        }} toggleDrawer={() => {
        }}/>
    </div>;
}

function HomeNavbar(props: DefaultNavbarParams) {
    const isMobile = useMediaQuery(768);
    return (
        <nav>
            {!isMobile ?
                <div
                    className="mb-0 grid grid-cols-12  2xl:text-4xl xl:text-3xl lg:text-3xl md:text-2xl py-14
               mr-10">
                    <div className="col-start-2 col-end-12 flex flex-wrap
                     justify-between items-center grid-cols-12 grid w-full">
                        <div className="flex col-start-1 col-end-10 justify-between">
                            <Link href="/about">
                                <a className="underlining"><h3>О нас</h3></a>
                            </Link>
                            <Link href="/materials">
                                <a className="underlining"><h3>Материалы</h3></a>
                            </Link>

                            <Link href="/tutors">
                                <a className="underlining"><h3>Преподаватели</h3></a>
                            </Link>
                        </div>
                        <AuthSection {...props}/>

                    </div>
                </div>
                :
                <MobileNavbar onClick={props.toggleDrawer} home={true}/>
            }

        </nav>);
}

interface NavParams {
    home: boolean;
    handleClickOpenWarning: () => void;
    toggleDrawer: () => void;
}

function Nav({home, handleClickOpenWarning, toggleDrawer}: NavParams) {
    if (home)
        return (
            <HomeNavbar {...{handleClickOpenWarning, toggleDrawer}}/>);
    else
        return (
            <DefaultNavbar {...{handleClickOpenWarning, toggleDrawer}}/>);
}


function ItemsList(props: { onClick: (event: (React.KeyboardEvent | React.MouseEvent)) => void,
    handleClickOpenWarning: () => void }) {
    const router = useRouter();
    const home: boolean = router.pathname === '/';
    return <Box
        sx={{width: 300}}
        role="presentation"
        onClick={props.onClick}
        onKeyDown={props.onClick}
    >
        <List>
            {/*  @ts-ignore  */}
            {toChildArray([
                {icon: NewsIcon, text: "О нас", link: "/about", alt: "news"},
                {icon: MaterialsIcon, text: "Материалы", link: "/materials", alt: "materials"},
                {icon: TutorsIcon, text: "Преподаватели", link: "/tutors", alt: "tutors"},
            ].map((item, index) => (
                <ListItemButton key={index} onClick={async () => await router.push(item.link)}>
                    <Image src={item.icon} className="w-6 mr-2" alt={item.alt}/>
                    <div>{item.text}</div>
                </ListItemButton>)))
            }
        </List>
        <Divider/>
        {!home ?
            <List>
                {/*  @ts-ignore  */}
                {toChildArray([
                    {icon: UsersIcon, text: "Профиль", alt: "users"},
                ].map((item, index) => (
                    <ListItemButton key={index} onClick={props.handleClickOpenWarning}>
                        <Image src={item.icon} className="w-6 mr-2" alt={item.alt}/>
                        <div>{item.text}</div>
                    </ListItemButton>)))
                }
            </List> : null}
    </Box>;
}


function Navbar() {
    const [state, setState] = React.useState({
        opened: false,
        warning: false
    });
    const router = useRouter();

    const home: boolean = router.pathname === '/' || router.pathname === '/404' || router.pathname === '/500';

    const handleClickOpenWarning = () => {
        setState({...state, warning: true});
    };
    const handleCloseWarning = () => {
        setState({...state, warning: false});
    };
    const isMobile = useMediaQuery(768);
    const toggleDrawer =
        () =>
            (event: React.KeyboardEvent | React.MouseEvent) => {
                if (
                    event &&
                    event.type === 'keydown' &&
                    ((event as React.KeyboardEvent).key === 'Tab' ||
                        (event as React.KeyboardEvent).key === 'Shift')
                ) {
                    return;
                }

                setState({...state, opened: !state.opened});
            };

    return (
        <header className="font-medium justify-center items-center grid grid-cols-1">
            <Nav {...{home, handleClickOpenWarning, toggleDrawer}}/>
            <WarningDialog handleClose={handleCloseWarning} opened={state.warning}/>
            {isMobile ?
                <SwappableDrawer
                    anchor='left'
                    open={state.opened}
                    onClose={toggleDrawer()}
                    onOpen={toggleDrawer()}
                    disableBackdropTransition={false}
                    // disableDiscovery={true}
                >
                    <ItemsList onClick={toggleDrawer()} {...{handleClickOpenWarning}}/>
                </SwappableDrawer> : null}

        </header>
    );
}

export default Navbar;
