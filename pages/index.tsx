import styles from '../styles/Home.module.css'
import {useSession, signIn, signOut} from "next-auth/react"
import React, {useEffect} from "react";
import db from '../lib/firebase/db'
import {initializeApp} from "firebase/app";
import {connectFirestoreEmulator, doc, getDoc, initializeFirestore, setLogLevel} from "firebase/firestore";
import {Tutor} from "../lib/backend/models";
//https://next-auth.js.org/configuration/options

class Index extends React.Component {

}

function Component() {
    useEffect(() => {
        // Update the document title using the browser API
        //
        // function createId(): string {
        //     return Math.random().toString(36).substring(5);
        // }
        //
        // const firebaseConfig = {
        //     apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        //     // authDomain: process.env.FIREBASE_AUTHs_DOMAIN,
        //     // databaseURL: process.env.FIREBASE_DATABASE_URL,
        //     projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        //     // storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        //     // messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        //     // appId: process.env.FIREBASE_APP_ID,
        //     // measurementId: process.env.FIREBASE_MEASUREMENT_ID
        // };
        // const app = initializeApp(firebaseConfig, createId());
        //
        //
        // // @ts-ignore
        // let db = initializeFirestore(app);
        // // await enableIndexedDbPersistence(db);
        // // const auth = getAuth(app);
        // // auth.useDeviceLanguage();
        //
        // // connectAuthEmulator(auth, "http://127.0.0.1:9099");
        // // setLogLevel('debug');
        // // @ts-ignore
        // connectFirestoreEmulator(db, 'localhost', '8080');

        // db.setLogLevel('debug');
        // db.settings({
        //     host: "localhost:8080",
        //     ssl: false
        // });
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
        getDoc(doc(db, 'tutors', 'vkrRHKVT4fSblCrd2RZ2')).then((value) => {
            console.log(value.data());
        });
    });
    const {data: session} = useSession();
    if (session) {

        return (
            <>
                Signed in as {session.user?.name ?? 'wha'} <br/>
                <button onClick={() => signOut()}>Sign out</button>
            </>
        )
    }
    return (
        <>
            Not signed in <br/>
            <button onClick={(e) => {
                e.preventDefault()
                signIn().then(() => {
                })
            }}>Sign in
            </button>
        </>
    )
}
export default Index;