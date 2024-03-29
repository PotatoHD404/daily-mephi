/*  ./components/Navbar.jsx     */
import Link from 'next/link';
import React, {useCallback, useEffect, useState} from 'react';
import NewsIcon from "images/news.svg";
import MaterialsIcon from "images/materials.svg";
import TutorsIcon from "images/tutors.svg";
import UsersIcon from "images/users.svg";
import {useRouter} from "next/router";
import Image from "next/image";
import burger from 'images/burger.svg'
import {useSession} from "next-auth/react";
import MiniCat from "images/minicat.svg";
import style from "styles/navbar.module.css";
import dynamic from "next/dynamic";


import {Box, Button, CircularProgress, Divider, IconButton} from '@mui/material';

import useIsMobile from "lib/react/isMobileContext";
import {Session} from "next-auth";
import {MyAppUser} from "lib/auth/nextAuthOptions";

const List = dynamic(() => import("@mui/material/List"), {ssr: true});
const ListItemButton = dynamic(() => import("@mui/material/ListItemButton"), {ssr: true});
const SwappableDrawer = dynamic(() => import("@mui/material/SwipeableDrawer"), {ssr: true});
const Minicat = dynamic(() => import("components/minicat"), {ssr: true});
const RegisterDialog = dynamic(() => import("./registerDialog"), {ssr: true});
const WarningDialog = dynamic(() => import("components/warningDialog"), {ssr: true});


interface DefaultNavbarParams {
    handleClickOpenWarning: () => void;
    toggleDrawer: () => void;
}


export function DefaultNavbar(props: DefaultNavbarParams) {
    const isMobile = useIsMobile();
    return (
        <nav className="grid-cols-12 grid text-[1.65rem] md:h-[5.5rem] w-full content-center mx-auto rounded-b-lg md:rounded-b-2xl
                         justify-between align-middle bg-white bg-opacity-[36%] md:px-8 max-w-[1280px]">
            {!isMobile ?
                <div className="flex col-start-1 col-end-13 justify-between">


                    <Link href="/" className="flex h-14 my-auto w-14 mb-2 -mt-2">
                        <button>
                            <Minicat/>
                        </button>
                    </Link>


                    <Link href="/about" className="underlining my-auto">
                        <h3>О нас</h3>
                    </Link>

                    <Link href="/search?types=Материал" className="underlining my-auto">
                        <h3>Материалы</h3>
                    </Link>

                    <Link href="/search?types=Преподаватель" className="underlining my-auto">
                        <h3>Преподаватели</h3>
                    </Link>
                    <AuthSection {...props}/>
                </div>
                :
                <div className="col-start-1 col-end-13">
                    <MobileNavbar onClick={props.toggleDrawer}/>
                </div>
            }

        </nav>
    );
}

function AuthSection(props: DefaultNavbarParams) {
    // const router = useRouter()
    const isMobile = useIsMobile();
    const {data: session, status} = useSession() as any as {
        data: Session & { user: MyAppUser },
        status: "authenticated" | "loading" | "unauthenticated"
    }
    const authenticated = status === 'authenticated';
    const loading = status === 'loading';
    const [open, setOpen] = useState(false)


    useEffect(() => {
        // console.log(session)
        if (session?.user && authenticated && !session.user.nickname && !loading) {
            setOpen(true);
        }
    }, [status, session, authenticated, loading])

    // console.log(session)
    // if (session?.user === null) {
    // return {
    //     redirect: {
    //         destination: '/users/new',
    //         permanent: false,
    //     },
    // }
    // }

    // async function getInitialProps(context: any) {
    //
    //
    //     return {
    //         props: { session }
    //     }
    // }

    if (status === "loading") {
        return (
            !isMobile ?
                <div
                    className={`${style.authText} underlining my-auto w-fit`}>
                    <h3>Загрузка...</h3>
                </div> : null
        )
    } else if (status === "unauthenticated") {
        return (
            !isMobile ?
                <button onClick={props.handleClickOpenWarning}
                        className={`${style.authText} underlining my-auto w-fit`}>
                    <h3>Войти</h3>
                </button> : null
        )
    } else {
        return (
            <>
                <RegisterDialog
                    handleClose={() => setOpen(false)}
                    opened={open}/>

                {!isMobile ?
                    <Link href={`/users/${session?.user?.id}`} className={`${style.authText} underlining my-auto w-fit`}>

                        <h3>{session.user?.name || "Профиль"}</h3>

                    </Link> : null}
            </>);
    }
}

function MobileNavbar(props: { onClick: () => void, home?: boolean }) {
    return (
        <div className="w-full">
            <div className={"flex justify-between h-12 pl-5 pr-5 items-center " + (props.home ? "mt-2" : "")}>
                <IconButton
                    aria-label="close"
                    onClick={props.onClick}
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
        </div>
    );
}

export function HomeNavbar(props: DefaultNavbarParams) {
    const isMobile = useIsMobile();
    return (
        <nav>
            {!isMobile ?
                <div
                    className="mb-0 grid grid-cols-12  2xl:text-4xl xl:text-3xl lg:text-3xl md:text-2xl py-14
               mr-10">
                    <div className="col-start-2 col-end-12 flex-wrap
                     justify-between items-center grid-cols-12 grid w-full">
                        <div className="flex col-start-1 col-end-10 justify-between">
                            <Link href="/about">
                                <h3 className="underlining">О нас</h3>
                            </Link>
                            <Link href="/search?types=Материал">
                                <h3 className="underlining">Материалы</h3>
                            </Link>

                            <Link href="/search?types=Преподаватель">
                                <h3 className="underlining">Преподаватели</h3>
                            </Link>
                        </div>
                        <AuthSection {...props}/>

                    </div>
                </div>
                :
                <MobileNavbar onClick={props.toggleDrawer} home={true}/>
            }

        </nav>
    );
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


function ItemsList(props: {
    onClick: (event: (React.KeyboardEvent | React.MouseEvent)) => void,
    handleClickOpenWarning: () => void
}) {
    const router = useRouter();
    const {data: session, status} = useSession() as any as {
        data: Session & { user: MyAppUser },
        status: "authenticated" | "loading" | "unauthenticated"
    }

    const isAuthenticated = status === "authenticated";
    const isLoading = status === "loading";
    const handleGotoProfile = () => {
        router.push(`/users/${session?.user?.id}`);
    }

    return <Box
        sx={{width: 300}}
        role="presentation"
        onClick={props.onClick}
        onKeyDown={props.onClick}
    >
        <List>
            {[
                {icon: NewsIcon, text: "О нас", link: "/about", alt: "news"},
                {icon: MaterialsIcon, text: "Материалы", link: "/search?types=Материал", alt: "materials"},
                {icon: TutorsIcon, text: "Преподаватели", link: "/search?types=Преподаватель", alt: "tutors"},
            ].map((item, index) => (
                <ListItemButton key={index} onClick={async () => await router.push(item.link)}>
                    <Image src={item.icon} className="w-6 mr-2" alt={item.alt}/>
                    <div>{item.text}</div>
                </ListItemButton>))
            }
        </List>
        <Divider/>
        <List>
            {[
                {
                    icon: UsersIcon, text: (
                        !isLoading ? (!isAuthenticated ? 'Войти' : 'Профиль') :
                            <CircularProgress color="inherit"
                                              thickness={3}
                                              size={30}
                                              className="my-auto"/>
                    ), alt: "users"
                },
            ].map((item, index) => (
                <ListItemButton key={index}
                                onClick={!isAuthenticated ? props.handleClickOpenWarning : handleGotoProfile}>
                    <Image src={item.icon} className="w-6 mr-2" alt={item.alt}/>
                    <div>{item.text}</div>
                </ListItemButton>))
            }
        </List>
    </Box>;
}


function Navbar(props: { needsAuth: boolean }) {
    const [warningState, setWarningState] = React.useState(false);
    const [openedState, setOpenedState] = React.useState(false);
    const router = useRouter();
    const isMobile = useIsMobile();
    const {data: session, status} = useSession() as any as {
        data: Session & { user: MyAppUser },
        status: "authenticated" | "loading" | "unauthenticated"
    };
    const authenticated = status == "authenticated";
    const loading = status == "loading";
    const home: boolean = router.pathname === '/' || router.pathname === '/404' || router.pathname === '/500';

    const handleClickOpenWarning = useCallback(() => {
        setWarningState(true)
    }, [])
    useEffect(() => {
        // console.log(props.needsAuth, authenticated)
        if (props.needsAuth && !authenticated && !loading) {
            handleClickOpenWarning();
        }
    }, [status, props.needsAuth, router.pathname, authenticated, loading, handleClickOpenWarning]);

    const handleCloseWarning = async () => {
        if (props.needsAuth && router.pathname && router.pathname !== "/signin") {
            await router.push("/");
        }
        setWarningState(false)
    };
    const toggleDrawer = (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event &&
            event.type === 'keydown' &&
            (event as React.KeyboardEvent).key === 'Tab') {
            return;
        }
        setOpenedState(!openedState)
    }


    return (
        <>
            <header className="font-medium justify-center items-center grid grid-cols-1">
                <Nav {...{
                    home, handleClickOpenWarning, toggleDrawer: toggleDrawer as any
                }}/>

                {isMobile ?
                    <SwappableDrawer
                        anchor='left'
                        open={openedState}
                        onClose={toggleDrawer}
                        onOpen={toggleDrawer}
                        disableBackdropTransition={false}
                        // disableDiscovery={true}
                    >
                        <ItemsList onClick={toggleDrawer} handleClickOpenWarning={handleClickOpenWarning}/>
                    </SwappableDrawer> : null}

            </header>
            <WarningDialog handleClose={handleCloseWarning} opened={warningState}/>
        </>
    );
}

export default Navbar;
