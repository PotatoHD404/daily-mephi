/*  ./components/Navbar.jsx     */
import Link from 'next/link';
import React from 'react';
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
import {useSession} from "next-auth/react";


function Nav({home, handleClickOpen}: { home: boolean, handleClickOpen: () => void }) {
    const {data: session, status} = useSession()
    if (home)
        return (
            <nav className="mb-0 flex grid-cols-12 grid text-4xl py-20">
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
                    {(status === "loading" || status === "unauthenticated" || !session) ?
                        <button onClick={handleClickOpen}
                                className="flex col-start-12 col-end-13 flex flex-wrap justify-end underlining w-fit outline-0">
                            <h3>Войти</h3>
                        </button> :
                        <button onClick={handleClickOpen}
                                className="flex col-start-12 col-end-13 flex flex-wrap justify-end underlining w-fit outline-0">
                            <h3>{session.user?.name}</h3>
                        </button>}


                </div>
            </nav>);
    else
        return (
            <nav className="grid-cols-12 grid text-[1.65rem] h-[5.5rem] w-full mx-auto rounded-b-2xl flex flex-wrap
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
                <div className="col-start-12 col-end-13 flex">
                    <button onClick={handleClickOpen}
                            className="text-left my-auto underlining -ml-2">
                        <h3>Войти</h3>
                    </button>
                </div>

            </nav>);
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
        <Box
            sx={{width: 300}}
            role="presentation"
            onClick={toggleDrawer()}
            onKeyDown={toggleDrawer()}
        >
            <List>
                {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                    <ListItem button key={text}>
                        <ListItemIcon>
                            {index % 2 === 0 ? <InboxIcon/> : <MailIcon/>}
                        </ListItemIcon>
                        <ListItemText primary={text}/>
                    </ListItem>
                ))}
            </List>
            <Divider/>
        </Box>
    );

    //greenBox
    return (
        <header className="font-medium justify-center items-center grid grid-cols-1">
            <Nav {...{home, handleClickOpen}}/>
            <WarningDialog handleClose={handleClose} opened={state.warning}/>
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
};

export default Navbar;