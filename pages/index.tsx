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
import template from '../images/template.png'
import Navbar from '../components/navbar'
import Link from 'next/link'
import Logo from '../images/logo.svg'
import Search from '../images/search.svg'
import MiniCat from '../images/minicat.svg'

//https://next-auth.js.org/configuration/options

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
            <div>
                <SEO title={'Главная'} description={'what?'}/>
                <div className={styles.bgWrap}><Image
                    src={template}
                    alt="Picture of the author"
                    width={1920}
                    height={1080}
                    quality={100}
                    objectFit="cover"
                /></div>
                <Navbar/>
                <div className="grid-cols-12 grid mt-20">
                    <div className="flex grid-cols-12 grid col-start-2 col-end-13 items-center">
                        <div
                            className="col-start-1 col-end-6 font-[Montserrat] items-center justify-start flex flex-wrap">

                            <div className="text-[6.25vw] -ml-1 flex whitespace-nowrap font-bold greenBox flex-nowrap">
                                <div className="greenBox w-20"><Image src={MiniCat} alt="mini cat"/></div>

                                <div>Daily MEPhi</div>
                            </div>
                            {/*<div className="ml-3"></div>*/}

                            <div className="flex text-4xl mt-8 greenBox">Lorem ipsum dolor sit amet, consectetur
                                adipisicing elit.
                                Animi officia quae quia suscipit? Animi aspernatur autem doloribus eos error.
                            </div>
                            <div className="p-4 mt-8 text-5xl flex outline rounded rounded-2xl w-5/6 greenBox">
                                <div className="mx-5">
                                    <Image src={Search} alt="Search"/>
                                </div>

                                <div>Поиск</div>
                            </div>
                        </div>

                        <div className="justify-start col-start-6 col-end-13 flex justify-center ">
                            <Image src={Logo} alt="Big logo" className="flex"/>
                        </div>
                    </div>
                </div>
            </div>
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