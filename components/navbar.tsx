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
import {getSession, signOut, useSession} from "next-auth/react";
import {Session} from "next-auth";


interface DefaultNavbarParams {
    onClick: () => void;
}

function DefaultNavbar(props: HomeNavbarParams) {
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
        <AuthSection onClick={props.onClick}/>

    </nav>;
}

interface HomeNavbarParams {
    // status: "authenticated" | "unauthenticated" | "loading";
    // session: Session | null;
    onClick: () => void;
}

interface AuthSectionParams {
    // status: "authenticated" | "unauthenticated" | "loading";
    // session: Session | null;
    onClick: () => void;
}

function AuthSection(props: AuthSectionParams) {
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
                className="flex col-start-12 col-end-13 flex flex-wrap justify-end underlining w-fit outline-0">
                <h3>Загрузка...</h3>
            </div>
        )
    } else if (status === "unauthenticated" || !session) {
        return (
            <button onClick={props.onClick}
                    className="flex col-start-12 col-end-13 flex flex-wrap justify-end underlining w-fit outline-0">
                <h3>Войти</h3>
            </button>
        )
    } else if (router.pathname === '/users/new') {
        return (
            <button className="flex col-start-12 col-end-13 flex flex-wrap justify-end underlining w-fit outline-0"
                    onClick={() => {
                        signOut({redirect: false}).then(() => router.push("/"))
                    }}>
                <h3>Выход</h3>
            </button>
        )
    } else {
        return (
            <button
                className="flex col-start-12 col-end-13 flex flex-wrap justify-end underlining w-fit outline-0">
                <h3>{session.user?.name}</h3>
            </button>
        )
    }
}

function HomeNavbar(props: HomeNavbarParams) {
    return <nav className="mb-0 flex grid-cols-12 grid text-4xl py-20">
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
            <AuthSection onClick={props.onClick}/>


        </div>
    </nav>;
}

interface NavParams {
    home: boolean;
    handleClickOpen: () => void;
}

function Nav({home, handleClickOpen}: NavParams) {
    if (home)
        return (
            <HomeNavbar onClick={handleClickOpen}/>);
    else
        return (
            <DefaultNavbar onClick={handleClickOpen}/>);
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

    const handleClickOpen = () => {
        setState({...state, warning: true});
    };
    const handleClose = () => {
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
            <Nav {...{home, handleClickOpen}}/>
            <WarningDialog handleClose={handleClose} opened={state.warning}/>
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
