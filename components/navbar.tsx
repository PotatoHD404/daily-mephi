/*  ./components/Navbar.jsx     */
import Link from 'next/link';
import React, {useState} from 'react';
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import ListItemText from "@mui/material/ListItemText";

import Image from 'next/image'
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import SwappableDrawer from "@mui/material/SwipeableDrawer";

const Navbar = () => {
    const [state, setState] = React.useState({
        opened: false
    });

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


    return (
        <header className="opacity-50">
            <nav className="bg-white border-gray-200 px-2 sm:px-4 py-12 dark:bg-gray-800">
                <div className="container flex flex-wrap justify-between items-left mx-auto">
                    <Link href="/" passHref>
                        <div className="flex text-white">
                            {/*<Image src="" alt=""/>*/}
                            <div>
                                Daily MEPhi
                            </div>
                        </div>
                    </Link>


                </div>
            </nav>
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