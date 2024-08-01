<script>
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { confetti } from '@neoconfetti/svelte';
	import Keyboard from './Keyboard.svelte';
	import WordList from './WordList.svelte';
	import { reduced_motion } from './reduced-motion';

	let pattern = '';
	let words = [];
	let userGuess = '';
	let message = '';
	let correctGuesses = [];
	const MIN_SCORE = 100;
	const MIN_WORD_COUNT = 50;

	let gameState = 'playing'; // 'playing', 'won'

	onMount(async () => {
		await generateNewPattern();
	});

	async function generateNewPattern() {
		const letters = 'abcdefghijklmnopqrstuvwxyz';
		let newPattern;
		do {
			newPattern =
				'*' +
				letters[Math.floor(Math.random() * 26)] +
				letters[Math.floor(Math.random() * 26)] +
				letters[Math.floor(Math.random() * 26)] +
				'*';
			words = await fetchWords(newPattern);
		} while (words.length < MIN_WORD_COUNT);

		pattern = newPattern.slice(1, -1);
		correctGuesses = [];
		message = '';
		gameState = 'playing';
	}

	async function fetchWords(pattern) {
		const response = await fetch(`https://api.datamuse.com/words?sp=${pattern}&max=1000`);
		const data = await response.json();
		return data
			.filter((item) => item.word.indexOf(' ') === -1 && item.score >= MIN_SCORE)
			.map((item) => item.word);
	}

	function checkGuess() {
		if (words.includes(userGuess) && !correctGuesses.includes(userGuess)) {
			correctGuesses = [userGuess, ...correctGuesses];
			message = 'Correct!';
			if (correctGuesses.length === words.length) {
				gameState = 'won';
			}
		} else if (correctGuesses.includes(userGuess)) {
			message = 'You already guessed that word!';
		} else {
			message = 'Incorrect. Try again!';
		}
		userGuess = '';
	}

	function handleKeyPress(event) {
		const key = event.detail;
		if (key === 'enter') {
			checkGuess();
		} else if (key === 'backspace') {
			userGuess = userGuess.slice(0, -1);
		} else if (userGuess.length < 15) {
			userGuess += key;
		}
	}
</script>

<main>
	<h1>Word Guessing Game</h1>

	<div class="info">
		<p>Today's pattern: <span class="pattern">{pattern}</span></p>
		<p>Correct guesses: {correctGuesses.length} / {words.length}</p>
	</div>

	<WordList {pattern} words={correctGuesses} />

	<div class="message" transition:fade>
		{message}
	</div>

	{#if gameState === 'playing'}
		<div class="user-input">
			<input type="text" bind:value={userGuess} placeholder="Type your guess" readonly />
			<button on:click={checkGuess} disabled={!userGuess}>Submit</button>
		</div>
		<Keyboard on:keyPress={handleKeyPress} {userGuess} />
	{:else}
		<div class="win-message" transition:fly={{ y: 200, duration: 2000 }}>
			<h2>Congratulations! You've guessed all the words!</h2>
			<button on:click={generateNewPattern}>Play Again</button>
		</div>
	{/if}
</main>

{#if gameState === 'won'}
	<div
		style="position: absolute; left: 50%; top: 30%"
		use:confetti={{
			particleCount: $reduced_motion ? 0 : undefined,
			force: 0.7,
			stageWidth: window.innerWidth,
			stageHeight: window.innerHeight,
			colors: ['#ff3e00', '#40b3ff', '#676778']
		}}
	></div>
{/if}

<style>
	main {
		max-width: 800px;
		margin: 0 auto;
		padding: 20px;
		font-family: Arial, sans-serif;
	}

	h1 {
		text-align: center;
		color: #ff3e00;
	}

	.info {
		text-align: center;
		margin-bottom: 20px;
	}

	.pattern {
		font-weight: bold;
		color: #8a2be2;
	}

	.message {
		text-align: center;
		font-size: 1.2em;
		margin: 20px 0;
		min-height: 1.5em;
	}

	.win-message {
		text-align: center;
		margin-top: 20px;
	}

	button {
		background-color: #ff3e00;
		color: white;
		border: none;
		padding: 10px 20px;
		font-size: 1em;
		cursor: pointer;
		border-radius: 5px;
	}

	button:hover {
		background-color: #ff6340;
	}
	.user-input {
		display: flex;
		justify-content: center;
		margin-bottom: 20px;
	}

	.user-input input {
		padding: 10px;
		font-size: 1rem;
		border: 1px solid #ccc;
		border-radius: 5px 0 0 5px;
		width: 200px;
	}

	.user-input button {
		padding: 10px 20px;
		font-size: 1rem;
		background-color: #ff3e00;
		color: white;
		border: none;
		border-radius: 0 5px 5px 0;
		cursor: pointer;
	}

	.user-input button:disabled {
		background-color: #ccc;
		cursor: not-allowed;
	}
</style>
