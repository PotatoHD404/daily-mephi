import {DocumentData, DocumentSnapshot, QuerySnapshot} from "@firebase/firestore";

/**
 * Takes in a snapshot and returns all of its `data()`,
 * as well as `id` and `createdAt` and `updatedAt` `Date`
 */

export function docSnapshotToObject<T>(snapshot: DocumentSnapshot): T  {
    const data: any = snapshot.data()
    if (data.expires) {
        data.expires = data.expires.toDate()
    }
    return {id: snapshot.id, ...data}
}

export function docSnapshotToObjectUndefined<T>(snapshot: DocumentSnapshot): T | null {
    if (!snapshot.exists) {
        return null
    }
    const data: any = snapshot.data()
    if (data.expires) {
        data.expires = data.expires.toDate()
    }
    return {id: snapshot.id, ...data}
}

export function querySnapshotToObject<T>(snapshot: QuerySnapshot): T | null {
    if (snapshot.empty) {
        return null
    }
    const doc = snapshot.docs[0]

    const data: any = doc.data()
    if (data.expires) {
        data.expires = data.expires.toDate()
    }
    return {id: doc.id, ...data}
}

/** Firebase does not like `undefined` values */
export function stripUndefined(obj: any): { [x: string]: Partial<unknown>; } {
    return Object.fromEntries(
        Object.entries(obj).filter(([, value]) => typeof value !== "undefined")
    ) as Partial<unknown>
}