// import type firebase from "firebase"
import {createHash, randomBytes} from "crypto"
import {Adapter} from "next-auth/adapters"
import {docSnapshotToObject, querySnapshotToObject, stripUndefined,} from "./utils"

import type {Firestore} from 'firebase/firestore';
import {addDoc, collection, doc, getDoc, getDocs, limit, query, where} from 'firebase/firestore';
import {Profile, Session, User} from "next-auth"

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
                async createUser(profile: Profile) {
                    const userRef = await addDoc(collection(db, "users"), stripUndefined({
                        name: profile.name,
                        email: profile.email,
                        image: profile.image,
                        emailVerified: profile.emailVerified ?? null,
                    }))
                    return docSnapshotToObject(userRef)
                },

                async getUser(id: string) {
                    const snapshot = await getDoc(doc(db, "users", id));
                    return docSnapshotToObject(snapshot)
                },

                async getUserByEmail(email: string | undefined | null) {
                    if (!email) return null;
                    const col = collection(db, "users");
                    const q = query(col, where("email", "==", email), limit(1));
                    const snapshot = await getDocs(q);
                    return querySnapshotToObject(snapshot)
                },

                async getUserByProviderAccountId(providerId: string, providerAccountId: string) {
                    const col = collection(db, "accounts");
                    const q = query(col,
                        where("providerId", "==", providerId),
                        where("providerAccountId", "==", providerAccountId),
                        limit(1));
                    const accountSnapshot = await getDocs(q);

                    if (accountSnapshot.empty) return null

                    const userId = accountSnapshot.docs[0].data().userId
                    const userSnapshot = await getDoc(doc(db, "users", userId));
                    return {...userSnapshot.data(), id: userSnapshot.id} as any
                },

                async updateUser(user) {
                    const userSnapshot = await getDoc(doc(db, "users", userId));

                    await db
                        .collection("users")
                        .doc(user.id)
                        .update(stripUndefined(user))

                    return user
                },

                async deleteUser(userId) {
                    await db.collection("users").doc(userId).delete()
                },

                async linkAccount(
                    userId,
                    providerId,
                    providerType,
                    providerAccountId,
                    refreshToken,
                    accessToken,
                    accessTokenExpires
                ) {
                    const accountRef = await db.collection("accounts").add(
                        stripUndefined({
                            userId,
                            providerId,
                            providerType,
                            providerAccountId,
                            refreshToken,
                            accessToken,
                            accessTokenExpires,
                        })
                    )

                    const accountSnapshot = await accountRef.get()
                    const account = docSnapshotToObject(accountSnapshot)
                    return account
                },

                async unlinkAccount(userId, providerId, providerAccountId) {
                    const snapshot = await db
                        .collection("accounts")
                        .where("userId", "==", userId)
                        .where("providerId", "==", providerId)
                        .where("providerAccountId", "==", providerAccountId)
                        .limit(1)
                        .get()

                    const accountId = snapshot.docs[0].id

                    await db.collection("accounts").doc(accountId).delete()
                },

                async createSession(user) {
                    const sessionRef = await db.collection("sessions").add({
                        userId: user.id,
                        expires: new Date(Date.now() + sessionMaxAge),
                        sessionToken: randomBytes(32).toString("hex"),
                        accessToken: randomBytes(32).toString("hex"),
                    })
                    const snapshot = await sessionRef.get()
                    const session = docSnapshotToObject(snapshot)
                    return session
                },

                async getSession(sessionToken) {
                    const snapshot = await db
                        .collection("sessions")
                        .where("sessionToken", "==", sessionToken)
                        .limit(1)
                        .get()

                    const session = querySnapshotToObject<FirebaseSession>(snapshot)
                    if (!session) return null

                    // if the session has expired
                    if (session.expires < new Date()) {
                        // delete the session
                        await db.collection("sessions").doc(session.id).delete()
                        return null
                    }
                    // return already existing session
                    return session
                },

                async updateSession(session, force) {
                    if (
                        !force &&
                        Number(session.expires) - sessionMaxAge + sessionUpdateAge >
                        Date.now()
                    ) {
                        return null
                    }

                    // Update the item in the database
                    await db
                        .collection("sessions")
                        .doc(session.id)
                        .update({
                            expires: new Date(Date.now() + sessionMaxAge),
                        })

                    return session
                },

                async deleteSession(sessionToken) {
                    const snapshot = await db
                        .collection("sessions")
                        .where("sessionToken", "==", sessionToken)
                        .limit(1)
                        .get()

                    const session = querySnapshotToObject<FirebaseSession>(snapshot)
                    if (!session) return

                    await db.collection("sessions").doc(session.id).delete()
                },

                async createVerificationRequest(identifier, url, token, _, provider) {
                    const verificationRequestRef = await db
                        .collection("verificationRequests")
                        .add({
                            identifier,
                            token: hashToken(token),
                            expires: new Date(Date.now() + provider.maxAge * 1000),
                        })

                    // With the verificationCallback on a provider, you can send an email, or queue
                    // an email to be sent, or perform some other action (e.g. send a text message)
                    await provider.sendVerificationRequest({
                        identifier,
                        url,
                        token,
                        baseUrl: appOptions.baseUrl,
                        provider,
                    })

                    const snapshot = await verificationRequestRef.get()
                    return docSnapshotToObject<FirebaseVerificationRequest>(snapshot)
                },

                async getVerificationRequest(identifier, token) {
                    const snapshot = await db
                        .collection("verificationRequests")
                        .where("token", "==", hashToken(token))
                        .where("identifier", "==", identifier)
                        .limit(1)
                        .get()

                    const verificationRequest =
                        querySnapshotToObject<FirebaseVerificationRequest>(snapshot)
                    if (!verificationRequest) return null

                    if (verificationRequest.expires < new Date()) {
                        // Delete verification entry so it cannot be used again
                        await db
                            .collection("verificationRequests")
                            .doc(verificationRequest.id)
                            .delete()
                        return null
                    }
                    return verificationRequest
                },

                async deleteVerificationRequest(identifier, token) {
                    const snapshot = await db
                        .collection("verificationRequests")
                        .where("token", "==", hashToken(token))
                        .where("identifier", "==", identifier)
                        .limit(1)
                        .get()

                    const verificationRequest =
                        querySnapshotToObject<FirebaseVerificationRequest>(snapshot)

                    if (!verificationRequest) return null

                    await db
                        .collection("verificationRequests")
                        .doc(verificationRequest.id)
                        .delete()
                },
            }
        },
    }
}