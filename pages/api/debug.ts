// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'


import {
    getFirestore,
    doc,
    getDoc,

    connectFirestoreEmulator,

    addDoc,
    collection as col,

    getDocs,
    limit,
    query,
    where,
    updateDoc,
    deleteDoc, enableIndexedDbPersistence, initializeFirestore, setLogLevel,
} from 'firebase/firestore'
import {Tutor} from '../../lib/backend/models'
import {FirebaseApp, getApp, getApps, initializeApp} from "firebase/app";
import {connectAuthEmulator, getAuth} from "firebase/auth";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Record<string, any> | string>
) {

    res.status(200).json({ok: 'ok'});
}
