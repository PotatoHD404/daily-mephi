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
import WarningDialog from '../components/warning';
import {useRouter} from "next/router";
import Image from "next/image";
import miniCat from '../images/minicat_transparent.svg'
import InputBase from "@mui/material/InputBase";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";


function Nav({home, handleClickOpen}: { home: boolean, handleClickOpen: () => void }) {
    if (home)
        return (
            <nav className="mb-0 flex grid-cols-12 grid text-4xl my-auto">
                <div className="col-start-2 col-end-12 flex flex-wrap
                     justify-between items-center grid-cols-12 grid">
                    <div className="flex col-start-1 col-end-10 justify-between">
                        <Link href="/about">
                            <a className="underlining">О нас</a>
                        </Link>

                        <Link href="/news">
                            <a className="underlining">Новости</a>
                        </Link>

                        <Link href="/materials">
                            <a className="underlining">Материалы</a>
                        </Link>

                        <Link href="/tutors">
                            <a className="underlining">Преподаватели</a>
                        </Link>
                    </div>

                    <button onClick={handleClickOpen}
                            className="flex col-start-12 col-end-13 flex flex-wrap justify-end underlining w-fit outline-0">
                        Войти
                    </button>

                </div>
            </nav>);
    else
        return (
            <nav className="grid-cols-12 grid text-[2.1rem] h-[9vh] w-full mx-auto rounded-b-2xl flex flex-wrap
                     justify-between align-middle bg-white bg-opacity-[36%] pl-20">

                <div className="flex col-start-1 col-end-10 justify-around">

                    <div className="flex h-16 my-auto w-20">
                        <Image
                            src={miniCat}
                            alt="Mini cat"
                        />
                    </div>

                    <div className="flex align-middle items-stretch h-12 w-[20rem] my-auto w-[27%] -ml-4">
                        <div

                            className="bg-transparent justify-center flex w-5/6 border-2
                                     border-black border-r-0 justify-center align-middle
                                     rounded-l-full pl-6 pr-2"
                        >
                            <InputBase
                                placeholder="Поиск"
                                inputProps={{'aria-label': 'Поиск'}}
                                className="font-[Montserrat] flex text-3xl w-11/12"
                            />
                        </div>
                        <Divider orientation="vertical" className="bg-black h-auto"/>
                        <div className="border-2 border-black border-l-0 rounded-r-full">
                            <Button aria-label="search"
                                    className="flex w-1/6 h-full rounded-none rounded-r-full"
                                    style={{color: 'black'}}
                            >
                                <SearchIcon style={{color: 'black'}} className="scale-125"/>
                            </Button>

                        </div>


                    </div>

                    <Link href="/news">
                        <a className="underlining my-auto">Новости</a>
                    </Link>

                    <Link href="/materials">
                        <a className="underlining my-auto">Материалы</a>
                    </Link>

                    <Link href="/tutors">
                        <a className="underlining my-auto">Преподаватели</a>
                    </Link>

                </div>

                <button onClick={handleClickOpen}
                        className="flex col-start-12 col-end-13 flex flex-wrap justify-end underlining w-fit outline-0">
                    Войти
                </button>


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