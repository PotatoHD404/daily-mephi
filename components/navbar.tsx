/*  ./components/Navbar.jsx     */
import Link from 'next/link';
import React, {useEffect} from 'react';
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import SwappableDrawer from "@mui/material/SwipeableDrawer";
import WarningDialog from 'components/warning';
import {useRouter} from "next/router";
import Image from "next/image";
import miniCat from 'images/minicat_transparent.svg'
import burger from 'images/burger.svg'
import {getSession, signOut, useSession} from "next-auth/react";
import {Session} from "next-auth";
import MiniCat from "images/minicat.svg";
import style from "styles/navbar.module.css";
import {inspect} from "util";


interface DefaultNavbarParams {
    handleClickOpenWarning: () => void;
    toggleDrawer: () => void;
}

function DefaultNavbar(props: DefaultNavbarParams) {
    return <nav className="grid-cols-12 grid text-[1.65rem] h-[5.5rem] w-full mx-auto rounded-b-2xl flex flex-wrap
                     justify-between align-middle bg-white bg-opacity-[36%] pl-8">

        <div className="flex col-start-1 col-end-11 w-11/12 justify-around">


            <Link href="/">
                <a className="flex h-14 my-auto w-14">
                    <Image
                        src={miniCat}
                        alt="Mini cat"
                    />
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

        </div>
        <AuthSection {...props}/>

    </nav>;
}

function AuthSection(props: DefaultNavbarParams) {
    const router = useRouter()
    const {data: session, status} = useSession()
    useEffect(() => {
        if (session?.user && session.user.name === null) {
            router.push('/users/new')
        }
    }, [status])

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
            <div
                className={style.authText}>
                <h3>Загрузка...</h3>
            </div>
        )
    } else if (status === "unauthenticated" || !session) {
        return (
            <button onClick={props.handleClickOpenWarning}
                    className={style.authText}>
                <h3>Войти</h3>
            </button>
        )
    } else if (router.pathname === '/users/new') {
        return (
            <button className={style.authText}
                    onClick={() => {
                        signOut({redirect: false}).then(() => router.push("/"))
                    }}>
                <h3>Выход</h3>
            </button>
        )
    } else {
        return (
            <button
                className={style.authText}>
                <h3>{session.user?.name}</h3>
            </button>
        )
    }
}

function HomeNavbar(props: DefaultNavbarParams) {

    return (
        <nav>
            <div className="hidden md:flex">
                <div className="mb-0 flex grid-cols-12 grid 2xl:text-4xl xl:text-3xl lg:text-3xl md:text-2xl py-20">
                    <div className="col-start-2 col-end-12 flex flex-wrap
                     justify-between items-center grid-cols-12 grid">
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
            </div>
            <div className="md:hidden">
                <div className="flex justify-between h-12 mt-2  pl-5 pr-5">
                    <div className="flexgrid h-full">
                        {/* @ts-ignore */}
                        <button className="h-full" onClick={props.toggleDrawer()}>
                            <Image className="flex" src={burger}/>
                        </button>
                    </div>
                    <Link href="/">
                        <a className="flex h-full w-12">
                            <Image src={MiniCat} alt="mini cat"
                                   className="flex scale-"
                                // layout="responsive"
                            />

                        </a>
                    </Link>
                </div>
            </div>

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


function ItemsList(props: { onClick: (event: (React.KeyboardEvent | React.MouseEvent)) => void, callbackfn: (text: any, index: any) => JSX.Element }) {
    return <Box
        sx={{width: 300}}
        role="presentation"
        onClick={props.onClick}
        onKeyDown={props.onClick}
    >
        <List>
            {["Inbox", "Starred", "Send email", "Drafts"].map(props.callbackfn)}
        </List>
        <Divider/>
    </Box>;
}


function Navbar() {
    const [state, setState] = React.useState({
        opened: false,
        warning: false
    });
    const router = useRouter();

    const home: boolean = router.pathname === '/';

    const handleClickOpenWarning = () => {
        setState({...state, warning: true});
    };
    const handleCloseWarning = () => {
        setState({...state, warning: false});
    };

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

    const list = (
        <ItemsList onClick={toggleDrawer()} callbackfn={(text, index) => (
            // TODO: checkout deprecated property
            <ListItem button key={text}>
                <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon/> : <MailIcon/>}
                </ListItemIcon>
                <ListItemText primary={text}/>
            </ListItem>
        )}/>
    );

    //greenBox
    return (
        <header className="font-medium justify-center items-center grid grid-cols-1">
            <Nav {...{home, handleClickOpenWarning, toggleDrawer}}/>
            <WarningDialog handleClose={handleCloseWarning} opened={state.warning}/>
            {/* @ts-ignore*/}
            <SwappableDrawer
                className={'lg:hidden'}
                anchor={'left'}
                open={state.opened}
                onClose={toggleDrawer()}
                onOpen={toggleDrawer()}
                disableBackdropTransition={false}
                // disableDiscovery={true}
            >
                {list}
            </SwappableDrawer>


        </header>
    );
}

export default Navbar;
