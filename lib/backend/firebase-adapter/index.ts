// import type firebase from "firebase"
import {createHash, randomBytes} from "crypto"
import {Adapter, AdapterSession, AdapterUser, VerificationToken} from "next-auth/adapters"
import {docSnapshotToObject, docSnapshotToObjectUndefined, querySnapshotToObject, stripUndefined,} from "./utils"

import type {Firestore} from 'firebase/firestore';
import {addDoc, collection, doc, getDoc, getDocs, limit, query, where, updateDoc, deleteDoc} from 'firebase/firestore';
import {Account, Profile, Session, User} from "next-auth"

import {SessionOptions} from "next-auth/core/types";


interface FirebaseVerificationRequest {
    id: string
    identifier: string
    token: string
    expires: Date
}

export type FirebaseSession = Session & {
    id: string
    expires: Date
}

export type AdapterParams = { session: SessionOptions, secret: Session, appOptions: { baseUrl: string } }

// @ts-expect-error
export const FirebaseAdapter: Adapter<Firestore,
    never,
    User & { id: string },
    Profile,
    FirebaseSession> = (db: Firestore) => {
    return {
        async getAdapter({session, secret, ...appOptions}: AdapterParams) {
            const sessionMaxAge = session.maxAge * 1000 // default is 30 days
            const sessionUpdateAge = session.updateAge * 1000 // default is 1 day
            /**
             * @todo Move this to core package
             * @todo Use bcrypt or a more secure method
             */
            const hashToken = (token: string) =>
                createHash("sha256").update(`${token}${secret}`).digest("hex")

            return {
                displayName: "Firebase",
                async createUser(profile: Omit<AdapterUser, "id">): Promise<AdapterUser> {
                    const userRef = await addDoc(collection(db, "users"), stripUndefined({
                        name: profile.name,
                        email: profile.email,
                        image: profile.image,
                        emailVerified: profile.emailVerified ?? null,
                    }))
                    const snapshot = await getDoc(userRef);
                    return docSnapshotToObject(snapshot)
                },

                async getUser(id: string): Promise<AdapterUser | null> {
                    const snapshot = await getDoc(doc(db, "users", id));
                    return docSnapshotToObjectUndefined(snapshot)
                },

                async getUserByEmail(email: string): Promise<AdapterUser | null> {
                    if (!email) return null;
                    const col = collection(db, "users");
                    const q = query(col, where("email", "==", email), limit(1));
                    const snapshot = await getDocs(q);
                    return querySnapshotToObject(snapshot)
                },
                // https://github.com/nextauthjs/next-auth/blob/50fe115df6379fffe3f24408a1c8271284af660b/src/adapters.ts
                async getUserByAccount({
                                           provider,
                                           providerAccountId
                                       }: Pick<Account, "provider" | "providerAccountId">):
                    Promise<AdapterUser | null> {
                    const col = collection(db, "accounts");
                    const q = query(col,
                        where("providerId", "==", provider),
                        where("providerAccountId", "==", providerAccountId),
                        limit(1));
                    const accountSnapshot = await getDocs(q);

                    if (accountSnapshot.empty) return null

                    const userId = accountSnapshot.docs[0].data().userId;
                    const userSnapshot = await getDoc(doc(db, "users", userId));
                    return {...userSnapshot.data(), id: userSnapshot.id} as any;
                },

                async updateUser(user: Partial<AdapterUser>): Promise<AdapterUser> {
                    if (!user.id)
                        throw Error("User id is not set!");
                    const userSnapshot = await updateDoc(doc(db, "users", user.id), stripUndefined(user));


                    return user as AdapterUser;
                },

                async deleteUser(userId: string): Promise<void> {
                    await deleteDoc(doc(db, "users", userId));
                },

                async linkAccount(account: Account) {
                    const accountRef = await addDoc(collection(db, "accounts"),
                        stripUndefined(account)
                    );

                    const accountSnapshot = await getDoc(accountRef);
                    return docSnapshotToObjectUndefined(accountSnapshot);
                },

                async unlinkAccount({
                                        provider,
                                        providerAccountId
                                    }: Pick<Account, "provider" | "providerAccountId">): Promise<void> {
                    const coll = collection(db, "accounts");
                    const q = query(coll, where("providerId",
                            "==", provider), where("providerAccountId",
                            "==", providerAccountId),
                        limit(1));
                    const snapshot = await getDocs(q);

                    const accountId = snapshot.docs[0].id;

                    await deleteDoc(doc(db, "accounts", accountId));
                },

                async createSession(session: {
                    sessionToken: string
                    userId: string
                    expires: Date
                }): Promise<AdapterSession> {
                    const sessionRef = await addDoc(collection(db, "sessions"), {
                        userId: session.userId,
                        expires: new Date(session.expires),
                        sessionToken: randomBytes(32).toString("hex"),
                        accessToken: randomBytes(32).toString("hex"),
                    });
                    const snapshot = await getDoc(sessionRef);
                    return docSnapshotToObject(snapshot);
                },

                async getSession(sessionToken: string): Promise<{ session: AdapterSession; user: AdapterUser } | null> {
                    const col = collection(db, "sessions");
                    const q = query(col,
                        where("sessionToken", "==", sessionToken),
                        limit(1));
                    const snapshot = await getDocs(q);

                    const session = querySnapshotToObject<AdapterSession>(snapshot);
                    if (!session) return null;

                    // if the session has expired
                    if (session.expires < new Date()) {
                        // delete the session
                        await deleteDoc(doc(db, "sessions", session.id));
                        return null
                    }
                    // return already existing session
                    const anotherSnapshot = await getDoc(doc(db, "users", session.userId));
                    const user: AdapterUser = docSnapshotToObject(anotherSnapshot)
                    return {session, user};
                },

                async updateSession(session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">):
                    Promise<AdapterSession | null | undefined> {
                    if (
                        Number(session.expires) - sessionMaxAge + sessionUpdateAge >
                        Date.now()
                    ) {
                        return null;
                    }

                    if (!session.id)
                        throw Error("Session id is not set!");

                    // Update the item in the database
                    await updateDoc(doc(db, "sessions", session.id), {
                        expires: new Date(Date.now() + sessionMaxAge),
                    });

                    const snapshot = await getDoc(doc(db, "sessions", session.id));
                    return docSnapshotToObject<AdapterSession>(snapshot);
                },

                async deleteSession(sessionToken: string): Promise<void> {
                    const col = collection(db, "sessions");
                    const q = query(col,
                        where("sessionToken", "==", sessionToken),
                        limit(1));
                    const snapshot = await getDocs(q);

                    const session = querySnapshotToObject<AdapterSession>(snapshot);
                    if (!session) return;

                    await deleteDoc(doc(db, "sessions", session.id));
                },

                async createVerificationToken(verificationToken: VerificationToken):
                    Promise<VerificationToken | null | undefined> {
                    const verificationRequestRef = await addDoc(collection(db, "verificationRequests")
                        , verificationToken);

                    const snapshot = await getDoc(verificationRequestRef);
                    return docSnapshotToObjectUndefined<VerificationToken>(snapshot);
                },

                async useVerificationToken({identifier, token}: {
                    identifier: string
                    token: string
                }): Promise<VerificationToken | null> {
                    const col = collection(db, "verificationRequests");
                    const q = query(col,
                        where("token", "==", hashToken(token)),
                        where("identifier", "==", identifier),
                        limit(1));
                    const snapshot = await getDocs(q);

                    const verificationRequest = querySnapshotToObject<VerificationToken>(snapshot);

                    if (!verificationRequest) return null;


                    await deleteDoc(doc(db, "verificationRequests", verificationRequest.identifier));
                    return verificationRequest;
                },
            }
        },
    }
}