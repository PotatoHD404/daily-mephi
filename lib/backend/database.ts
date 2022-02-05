// import  from 'firebase-admin'

// import {getAuth} from "firebase-admin";
import {decrypt} from "./crypto"

import {App, cert, Credential, initializeApp, getApp, getApps} from 'firebase-admin/app';
import {getAuth} from 'firebase-admin/auth';
import fs from "fs";

// let app: App;

export async function initializeDatabase() {
    if (getApps().length === 0) {
        let credentials: string = fs.readFileSync("firebaseCredentialsEncrypted.b64", 'binary');
        credentials = await decrypt(credentials);
        const cred: Credential = cert(JSON.parse(credentials));
        initializeApp({
            credential: cred,
            databaseURL: process.env.FIREBASE_DATABASE_URL,
            projectId: process.env.FIREBASE_PROJECT_ID,
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        });
    }
}

export async function getAuthToken(uid: string): Promise<string> {
    return getAuth(getApp()).createCustomToken(uid);
}

// https://firebase.google.com/docs/auth/web/custom-auth#web-version-9
