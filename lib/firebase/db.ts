import {connectFirestoreEmulator, enableIndexedDbPersistence, getFirestore} from 'firebase/firestore';
import firebaseApp from './app';

const firestore = getFirestore(firebaseApp);

if (process.env.NODE_ENV === 'development') {
    connectFirestoreEmulator(firestore, 'localhost', 8080);
}



export default firestore;