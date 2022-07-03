// import {Adapter, AdapterSession, AdapterUser, VerificationToken} from "next-auth/adapters"
// import {docSnapshotToObject, docSnapshotToObjectUndefined, querySnapshotToObject, stripUndefined,} from "./utils"
//
// import {
//     addDoc,
//     collection,
//     doc,
//     getDoc,
//     getDocs,
//     limit,
//     query,
//     where,
//     updateDoc,
//     deleteDoc,
//     getFirestore
// } from 'firebase/firestore';
// import {Account} from "next-auth"
//
// import {getAuthToken, initializeAdmin} from "../database";
// import {getAuth, signInWithCustomToken} from "firebase/auth";
// // import app from "../../helpers/database";
// import {randomBytes} from "crypto";
//
//
// export default function FirebaseAdapter(): Adapter {
//
//     async function db() {
//         const auth = getAuth();
//         if (auth.currentUser?.uid != 'admin') {
//             await initializeAdmin();
//
//
//             await signInWithCustomToken(auth, await getAuthToken('admin'));
//         }
//         return getFirestore();
//     }
//
//     // displayName: "Firebase",
//     return {
//         async createUser(user: Omit<AdapterUser, "id">): Promise<AdapterUser> {
//             user.emailVerified = undefined;
//             const userRef = await addDoc(collection(await db(), "users"), stripUndefined(user));
//             const snapshot = await getDoc(userRef);
//             return docSnapshotToObject(snapshot);
//         },
//
//         async getUser(id: string): Promise<AdapterUser | null> {
//             const snapshot = await getDoc(doc(await db(), "users", id));
//             return docSnapshotToObjectUndefined(snapshot);
//         },
//
//         async getUserByEmail(email: string): Promise<AdapterUser | null> {
//             if (!email) return null;
//             const col = collection(await db(), "users");
//             const q = query(col, where("email", "==", email), limit(1));
//             const snapshot = await getDocs(q);
//             return querySnapshotToObject(snapshot);
//         },
//         // https://github.com/nextauthjs/next-auth/blob/50fe115df6379fffe3f24408a1c8271284af660b/src/adapters.ts
//         async getUserByAccount({
//                                    provider,
//                                    providerAccountId
//                                }: Pick<Account, "provider" | "providerAccountId">):
//             Promise<AdapterUser | null> {
//             const col = collection(await db(), "accounts");
//             const q = query(col,
//                 where("provider", "==", provider),
//                 where("providerAccountId", "==", providerAccountId),
//                 limit(1));
//             const accountSnapshot = await getDocs(q);
//             if (accountSnapshot.empty) return null;
//
//             const userId = accountSnapshot.docs[0].data().userId;
//             const userSnapshot = await getDoc(doc(await db(), "users", userId));
//             return {...userSnapshot.data(), id: userSnapshot.id} as AdapterUser;
//         },
//
//         async updateUser(user: Partial<AdapterUser>): Promise<AdapterUser> {
//             if (!user.id)
//                 throw Error("User id is not set!");
//             user.emailVerified = undefined;
//
//             await updateDoc(doc(await db(), "users", user.id), stripUndefined(user));
//
//             return user as AdapterUser;
//         },
//
//         async deleteUser(userId: string): Promise<void> {
//             await deleteDoc(doc(await db(), "users", userId));
//         },
//
//         async linkAccount(account: Account): Promise<void> {
//             await addDoc(collection(await db(), "accounts"),
//                 stripUndefined(account)
//             );
//         },
//
//         async unlinkAccount({
//                                 provider,
//                                 providerAccountId
//                             }: Pick<Account, "provider" | "providerAccountId">): Promise<void> {
//             const coll = collection(await db(), "accounts");
//             const q = query(coll, where("provider",
//                     "==", provider), where("providerAccountId",
//                     "==", providerAccountId),
//                 limit(1));
//             const snapshot = await getDocs(q);
//
//             const accountId = snapshot.docs[0].id;
//
//             await deleteDoc(doc(await db(), "accounts", accountId));
//         },
//
//         async createSession(session: {
//             sessionToken: string
//             userId: string
//             expires: Date
//         }): Promise<AdapterSession> {
//             const sessionRef = await addDoc(collection(await db(), "sessions"), {
//                 userId: session.userId,
//                 expires: new Date(session.expires),
//                 sessionToken: randomBytes(32).toString("hex"),
//                 accessToken: randomBytes(32).toString("hex"),
//             });
//             const snapshot = await getDoc(sessionRef);
//             return docSnapshotToObject(snapshot);
//         },
//
//         async getSessionAndUser(sessionToken: string): Promise<{ session: AdapterSession; user: AdapterUser } | null> {
//             const col = collection(await db(), "sessions");
//             const q = query(col,
//                 where("sessionToken", "==", sessionToken),
//                 limit(1));
//             const snapshot = await getDocs(q);
//
//             const session = querySnapshotToObject<AdapterSession>(snapshot);
//             if (!session) return null;
//
//             // if the session has expired
//             if (session.expires < new Date()) {
//                 // delete the session
//                 await deleteDoc(doc(await db(), "sessions", session.id));
//                 return null;
//             }
//             // return already existing session
//             const anotherSnapshot = await getDoc(doc(await db(), "users", session.userId));
//             const user: AdapterUser = docSnapshotToObject(anotherSnapshot);
//             return {session, user};
//         },
//
//         async updateSession(session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">):
//             Promise<AdapterSession | null | undefined> {
//
//             if (!session.id || !session.expires)
//                 throw Error("Session id is not set!");
//
//             // Update the item in the database
//             await updateDoc(doc(await db(), "sessions", session.id), {
//                 expires: new Date(session.expires),
//             });
//
//             const snapshot = await getDoc(doc(await db(), "sessions", session.id));
//             return docSnapshotToObject<AdapterSession>(snapshot);
//         },
//
//         async deleteSession(sessionToken: string): Promise<void> {
//             const col = collection(await db(), "sessions");
//             const q = query(col,
//                 where("sessionToken", "==", sessionToken),
//                 limit(1));
//             const snapshot = await getDocs(q);
//
//             const session = querySnapshotToObject<AdapterSession>(snapshot);
//             if (!session) return;
//
//             await deleteDoc(doc(await db(), "sessions", session.id));
//         },
//
//         async createVerificationToken(verificationToken: VerificationToken):
//             Promise<VerificationToken | null | undefined> {
//             const verificationRequestRef = await addDoc(collection(await db(), "verificationRequests")
//                 , verificationToken);
//
//             const snapshot = await getDoc(verificationRequestRef);
//             return docSnapshotToObjectUndefined<VerificationToken>(snapshot);
//         },
//
//         async useVerificationToken({identifier, token}: {
//             identifier: string
//             token: string
//         }): Promise<VerificationToken | null> {
//             const col = collection(await db(), "verificationRequests");
//             const q = query(col,
//                 where("token", "==", token),
//                 where("identifier", "==", identifier),
//                 limit(1));
//             const snapshot = await getDocs(q);
//
//             const verificationRequest = querySnapshotToObject<VerificationToken>(snapshot);
//
//             if (!verificationRequest) return null;
//
//
//             await deleteDoc(doc(await db(), "verificationRequests", verificationRequest.identifier));
//             return verificationRequest;
//         },
//     }
// }