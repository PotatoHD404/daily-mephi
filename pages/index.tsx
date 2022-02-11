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
import template from '../images/template.jpg'


//https://next-auth.js.org/configuration/options

class Home extends Component<{ session: Session }> {

    constructor(props: any) {
        super(props);
        this.state = {
            name: "React",
        };


        // Binding method
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

                <div>data</div>
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