import { derived, writable } from 'svelte/store';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';

import { uniqueNamesGenerator, starWars, colors } from 'unique-names-generator';
import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/micah';

import { auth } from '$lib/firebase';

const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const userStore: any = writable(null);

export const userProfileStore = derived(
	userStore,
	$userStore => {
        return {
            name: $userStore?.uid ? capitalizeFirstLetter(uniqueNamesGenerator({
                dictionaries: [colors, starWars],
                seed: $userStore?.uid,
                separator: ' ',
            })) : '',
            avatar: $userStore?.uid ? createAvatar(style, {
                seed: $userStore?.uid,
                // ... and other options
            }) : false,
        }
    }
);

export const initUserStore = () => {
	console.log('🆕 Initializing store: user');
	onAuthStateChanged(auth(), (newUser) => {
		console.log('User login status update: onAuthStateChanged triggered');

		if (newUser) {
			// User is signed in, see docs for a list of available properties
			// https://firebase.google.com/docs/reference/js/firebase.User

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			userStore.update((oldUser) => newUser);
		} else {
			// User is signed out
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			userStore.update((oldUser) => false);
		}
	});
};

// Substitute this for whatever you want the login flow to look like
export const loginUser = async () => {
    try {
        await signInAnonymously(auth());
    } catch(e) {
        console.error('Could not sign in anonymous user', e);
    }    
}