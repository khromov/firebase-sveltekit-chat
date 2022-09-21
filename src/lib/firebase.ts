import { env } from '$env/dynamic/public';
import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import {
	addDoc,
	collection,
	serverTimestamp,
	connectFirestoreEmulator,
	initializeFirestore,
	CACHE_SIZE_UNLIMITED,
} from 'firebase/firestore';

// import type { DocumentReference, DocumentData } from 'firebase/firestore';
import type { FirebaseApp } from 'firebase/app';
import { enableMultiTabIndexedDbPersistence } from 'firebase/firestore';


const config = {
    useEmulators: env?.PUBLIC_USE_EMULATORS || false,
    region: env?.PUBLIC_REGION || 'europe-west3',
    firebase: {
        apiKey: env?.PUBLIC_FIREBASE_FIREBASE_APIKEY || 'AIzaSyA1S9279M2SQYofCW7-O6L3oO_c8pb9u3k',
		authDomain: env?.PUBLIC_FIREBASE_AUTH_DOMAIN || 'f-kit-chat.firebaseapp.com',
		projectId: env?.PUBLIC_FIREBASE_PROJECT_ID || 'f-kit-chat',
		storageBucket: env?.PUBLIC_FIREBASE_STORAGE_BUCKET  || 'f-kit-chat.appspot.com',
		messagingSenderId: env?.PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '774903391068',
		appId: env?.PUBLIC_FIREBASE_APP_ID || '1:774903391068:web:9f24bb0f057348d2bbd799'
    }
}

let app: FirebaseApp;

let initializedFirestore: any = null;

let connectedFirestoreEmulator = false;
let connectedAuthEmulator = false;

// These functions should be called in onMount when used in components
export const auth = () => {
	const auth = getAuth(app);

	if (config.useEmulators && !connectedAuthEmulator) {
		console.log('👓 Connecting Firebase Auth Emulator');
		connectedAuthEmulator = true;
		connectAuthEmulator(auth, 'http://localhost:9099');
	}

	return auth;
};
export const db = () => {
	if (!initializedFirestore) {
		console.log('🔥 Initializing Firestore');

		initializedFirestore = initializeFirestore(app, {
			cacheSizeBytes: CACHE_SIZE_UNLIMITED
		});
	}

	if (config.useEmulators && !connectedFirestoreEmulator) {
		console.log('👓 Connecting Firestore Emulator');
		connectedFirestoreEmulator = true;
		connectFirestoreEmulator(initializedFirestore, 'localhost', 8090);
	}

	return initializedFirestore;
};

export const initialize = async () => {
	console.log('🔥 Initializing Firebase SDK');
    console.log(config.firebase);
	app = initializeApp(config.firebase);

	try {
        // Uncomment for enhanced persistence mode
		// await enableMultiTabIndexedDbPersistence(db()); // TODO: forceOwnership: true <= for web workers, but how can it be used together with Svelte?
		// console.log('✍️ Persistence mode enabled!'); // TODO: Something like https://github.com/thebrianchen/firestore-web-worker ?
	} catch (err: any) {
		// Todo: If we're in capacitor and this happens, we need to either bail somehow,
		// close the app or show error state asking user to log in again(?)
		// Or just disable persistence and show immediate "It looks like you're offline" error.
		if (err?.code == 'failed-precondition') {
			console.warn("Couldn't enable persistence", err);
		} else if (err?.code == 'unimplemented') {
			console.warn('Persistence mode not implemented', err);
		} else {
			console.warn('Persistence mode error: ', err);
		}
	}
};

export const addMessage = async (name: string, message: string) => {
	const docRef = await addDoc(collection(db(), 'messages'), {
        name,
		message,
		time: serverTimestamp(), // https://firebase.google.com/docs/firestore/manage-data/add-data#server_timestamp
	});
	console.log('Chat message written with ID: ', docRef.id);
	return docRef;
};