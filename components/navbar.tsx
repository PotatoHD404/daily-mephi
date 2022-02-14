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


const Navbar = () => {
    const [state, setState] = React.useState({
        opened: false,
        warning: false
    });

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
            <nav className="mb-0 flex grid-cols-12 grid text-4xl my-auto">


                <div className="col-start-2 col-end-12 flex flex-wrap
                 justify-between items-center grid-cols-12 grid">
                    <div className="flex col-start-1 col-end-10 justify-between">
                        <div className="flex underlining">
                            <Link href="/about">
                                О нас
                            </Link>
                        </div>

                        <div className="flex underlining">
                            <Link href="/news">
                                Новости
                            </Link>
                        </div>
                        <div className="flex underlining">
                            <Link href="/materials">
                                Материалы
                            </Link>
                        </div>

                        <div className="flex underlining">
                            <Link href="/tutors">
                                Преподаватели
                            </Link>
                        </div>
                    </div>

                    <button onClick={handleClickOpen}
                            className="flex col-start-12 col-end-13 flex flex-wrap justify-end underlining w-fit outline-0">
                        Войти
                    </button>

                </div>
            </nav>
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