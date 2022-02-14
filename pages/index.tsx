import styles from '../styles/Home.module.css'
import {useSession, signIn, signOut} from "next-auth/react"
import React, {Component, useEffect} from "react";
import db from '../lib/firebase/db'
import {initializeApp} from "firebase/app";
import {
    connectFirestoreEmulator,
    doc,
    getDoc,
    initializeFirestore,
    setLogLevel,
    collection as col,
    addDoc
} from "firebase/firestore";
import {Tutor} from "../lib/backend/models";
import PropTypes from "prop-types";
import withSession from "../components/withSession";
import {Session} from "next-auth";
import SEO from "../components/seo";
import Image from 'next/image'
import Navbar from '../components/navbar'
import Link from 'next/link'
import Logo from '../images/logo.svg'
import Search from '../images/search.svg'
import Footer from '../components/footer'
import MiniCat from '../images/minicat.svg'
import Button, {ButtonProps} from "@mui/material/Button";
import styled from '@emotion/styled';

import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';

//https://next-auth.js.org/configuration/options
// className="btn inline-block p-4 border-2 border-black leading-tight"


class Home extends Component<{ session: Session }> {

    constructor(props: any) {
        super(props);
    }


    async componentDidMount() {

        let data: Tutor = {
            id: 'string',
            name: 'string',
            old_rating: {
                character: -5,
                count: 1000,
                exams: -5,
                quality: 5
            },
            description: 'string',
            image: 'string',
            url: 'string',
            since: new Date(),
            updated: new Date(),
            disciplines: [],
            faculties: []
        };

        // console.log(db);
        // await enableIndexedDbPersistence(db);

        // console.log('1');
        // await addDoc(col(db, 'tutors'), data);
    }


    render() {
        return (
            <>
                <SEO title={'Главная'} description={'what?'}/>

                <div className="flex grid-cols-12 grid h-[73vh]">
                    <div className="flex col-start-2 col-end-13 items-center gap-4">
                        <div
                            className="items-center justify-start flex flex-wrap w-[42.8%]">

                            <div className="text-[6.25vw] -ml-1 -my-10 flex font-bold flex-nowrap">
                                <div
                                    className="flex h-fit w-[4vw] mt-[4vw] justify-center
                                     pl-[0.8vw] z-0">
                                    <Image src={MiniCat} alt="mini cat"
                                           className="flex scale-95 active:scale-110 transition ease-in-out duration-300"
                                        // layout="responsive"
                                    />

                                </div>

                                <div className="-ml-[4vw] z-10 mt-1.5 pointer-events-none">Daily MEPhi</div>
                            </div>
                            {/*<div className="ml-3"></div>*/}

                            <div className="flex text-4xl mt-8 row-start-3 row-end-4">Lorem ipsum dolor sit amet,
                                consectetur
                                adipisicing elit.
                                Animi officia quae quia suscipit? Animi aspernatur autem doloribus eos error.
                            </div>
                            <div
                                className="mt-14 text-5xl flex w-5/6 align-middle items-stretch">


                                <div

                                    className="bg-transparent justify-center flex w-5/6 border-2
                                     border-black border-r-0 justify-center align-middle
                                     rounded-l-full pl-6 pr-2"
                                >
                                    <InputBase
                                        placeholder="Поиск"
                                        inputProps={{'aria-label': 'Поиск'}}
                                        className="font-[Montserrat] flex text-4xl w-11/12"
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
                        </div>

                        <div className="flex justify-center w-[50%]">
                            <Image src={Logo} alt="Big logo"/>
                        </div>
                    </div>
                </div>

                {/*<Footer/>*/}
            </>
        )
    }
}


export default withSession(Home);


//        if (this.props.session) {
//
//             return (
//                 <>
//                     Signed in as {this.props.session.user?.name ?? 'wha'} <br/>
//                     <button onClick={() => signOut()}>Sign out</button>
//                 </>
//             )
//         }
//         return <>
//             Not signed in <br/>
//             <button onClick={(e) => {
//                 e.preventDefault()
//                 signIn().then(() => {
//                 })
//             }}>Sign in
//             </button>
//         </>;