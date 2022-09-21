import { writable } from 'svelte/store';
import { query, onSnapshot, collection, orderBy, limit } from 'firebase/firestore';
import { db } from '$lib/firebase';
import { userStore } from './user';

export const chatMessagesStore = writable([]);

let messagesUnsubscribeCallback;

const subscribeToMessages = async () => {

    const queryParams = [orderBy('time', 'desc'), limit(50)];

	// Start listener for new messages
	const q = query(collection(db(), 'messages'), ...queryParams);

	messagesUnsubscribeCallback = onSnapshot(
		q,
		(querySnapshot) => {
			const messages: any = [];
			querySnapshot.forEach((doc) => {
				messages.push({
					...doc.data(),
					id: doc.id,
					confirmed: !doc.metadata.hasPendingWrites,
					docRef: doc
				});
			});

			chatMessagesStore.update(() => {
				console.log('💥 querySnapshot: New data: ', messages);
				return [...messages];
			});
		},
		(error) => {
			console.warn("Couldn't update snapshot, maybe the user is logged out?", error);
		}
	);

	// TODO: Only h
	return messagesUnsubscribeCallback;
};

// Init chat store once user profile store has initialized
userStore.subscribe((user) => {
	console.log('Initializing store: messages');

    // We got a user
    // TODO: You also need to handle when user logs out here.
    // user will then be empty and you can reset your store and, 
    // detach the firebase listeners by calling
    //  messagesUnsubscribeCallback()
	if(user) {
        console.log('🆕 Got user', user)
        subscribeToMessages().catch((error) => {
            console.error(error);
        });
	} 
});