<script lang="ts">
	import { onMount } from 'svelte';
	import { addMessage, initialize } from '$lib/firebase';
	import { initUserStore, userStore, userProfileStore, loginUser } from '$lib/stores/user';
	import { chatMessagesStore } from '$lib/stores/messages';
	import Message from '$lib/components/Message.svelte';
	import GithubBanner from '$lib/components/GithubBanner.svelte';

	let message = '';
	let chatInput: undefined | HTMLInputElement;

	onMount(async () => {
		await initialize();
		await initUserStore();
		await loginUser();

		// Focus input
		chatInput?.focus();
	});

	const onSubmitMessage = async () => {
		if (message.trim().length === 0) {
			return;
		}

		const savedMessageText = message;
		message = '';

		try {
			await addMessage($userProfileStore.name, savedMessageText);
		} catch (e) {
			console.error('Error sending message', e);
		}
	};
</script>

<svelte:head>
	<title>F-kit chat</title>
</svelte:head>

<GithubBanner url="https://github.com/khromov/firebase-sveltekit-chat" />

<h1>Firebase + SvelteKit chat</h1>

<h2>
	You are henceforth known as: <br />
</h2>

<div class="avatar">
	{#if $userProfileStore?.avatar}
		{@html $userProfileStore?.avatar}
	{/if}
</div>

<h2>
	{$userProfileStore?.name}
</h2>

<form on:submit|preventDefault={onSubmitMessage}>
	<label hidden for="message">Message</label>
	<input
		type="text"
		id="message"
		name="message"
		bind:value={message}
		placeholder="What's on your mind?"
		autocomplete="off"
		required
		bind:this={chatInput}
	/>
	<input type="submit" value="Send" />
</form>

<div>
	{#each $chatMessagesStore as message (message.id)}
		<Message {message} />
	{/each}
</div>

<style>
	:global(body) {
		background-color: #ff5f7e;
		color: white;
		font-family: Arial, Helvetica, sans-serif;
	}

	form {
		margin-bottom: 15px;
	}

	h1,
	h2 {
		text-align: center;
	}

	.avatar {
		width: 128px;
		height: 128px;
		margin: 0 auto;
	}

	form {
		text-align: center;
	}
</style>
