<script>
	import { createEventDispatcher, onMount, onDestroy } from 'svelte';

	const dispatch = createEventDispatcher();
	export let userGuess = '';

	const rows = [
		['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
		['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
		['enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'backspace']
	];

	let pressedKey = null;

	function handleClick(key) {
		dispatch('keyPress', key);
		showKeyPress(key);
	}

	function showKeyPress(key) {
		pressedKey = key;
		setTimeout(() => {
			if (pressedKey === key) {
				pressedKey = null;
			}
		}, 100);
	}
</script>

<div class="keyboard">
	{#each rows as row}
		<div class="row">
			{#each row as key}
				<button
					on:click={() => handleClick(key)}
					class:wide={key === 'enter' || key === 'backspace'}
					class:pressed={pressedKey === key}
				>
					{key}
				</button>
			{/each}
		</div>
	{/each}
</div>

<style>
	.keyboard {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}
	.row {
		display: flex;
		justify-content: center;
		gap: 5px;
	}
	button {
		padding: 10px;
		font-size: 1rem;
		border: none;
		background-color: #d3d6da;
		cursor: pointer;
		border-radius: 5px;
		min-width: 30px;
		transition: background-color 0.1s;
	}
	button:hover:not(:disabled) {
		background-color: #bbc0c5;
	}
	button:active:not(:disabled),
	button.pressed:not(:disabled) {
		background-color: #a3a8ad;
	}
	button.wide {
		min-width: 65px;
	}
	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
