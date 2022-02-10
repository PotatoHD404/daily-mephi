import styles from '../styles/Home.module.css'
import {useSession, signIn, signOut} from "next-auth/react"
import React, {useEffect} from "react";
import db from '../lib/firebase/db'
import {initializeApp} from "firebase/app";
import {connectFirestoreEmulator, doc, getDoc, initializeFirestore, setLogLevel} from "firebase/firestore";
import {Tutor} from "../lib/backend/models";
import PropTypes from "prop-types";
import withSession from "../components/withSession";
import {Session} from "next-auth";

//https://next-auth.js.org/configuration/options

class Index extends React.Component<{ session: Session }> {

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

        // const collection = col(db, 'tutors');
        console.log('1');
        await getDoc(doc(db, 'tutors', 'vkrRHKVT4fSblCrd2RZ2')).then((value) => {
            console.log(value.data());
        });
    }


    render() {
        if (this.props.session) {

            return (
                <>
                    Signed in as {this.props.session.user?.name ?? 'wha'} <br/>
                    <button onClick={() => signOut()}>Sign out</button>
                </>
            )
        }
        return <>
            Not signed in <br/>
            <button onClick={(e) => {
                e.preventDefault()
                signIn().then(() => {
                })
            }}>Sign in
            </button>
        </>;
    }
}


export default withSession(Index);