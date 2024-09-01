<script lang="ts">
	import Keyboard from 'svelte-keyboard';
	import WordList from './WordList.svelte';
	import { calculateWordScore } from './wordScore';
	import { Toaster, toast } from 'svelte-sonner';
	let currentWord = '';
	let wordList: { word: string; score: number }[] = [];
	let wordBeingTyped = '';

	const onKeydown = async (event: KeyboardEvent | CustomEvent) => {
		let key: string;
		if (event instanceof KeyboardEvent) {
			key = event.key.toLowerCase();
		} else {
			key = event.detail.toLowerCase();
		}

		if (key.length === 1 && key.match(/[a-z]/)) {
			currentWord += key;
		} else if (key === 'enter') {
			if (currentWord.length > 0) {
				try {
					const score = await calculateWordScore(data.pattern, currentWord);
					// Don't add the word if it's already in the list
					if (wordList.some((word) => word.word === currentWord)) {
						toast.info('Word already in list');
						return;
					} else if (currentWord.length <= 4) {
						toast.error('Word must be at least 4 characters long');
						return;
					}
					wordList = [...wordList, { word: currentWord, score: score.totalScore }];
					currentWord = '';
				} catch (error) {
					if (
						error instanceof Error &&
						error.message === 'Word does not contain the required sequence'
					) {
						toast.error('Word does not contain the required sequence');
					} else {
						console.error('Error calculating word score:', error);
					}
				}
			}
		} else if (key === 'backspace') {
			currentWord = currentWord.slice(0, -1);
		}
	};

	export let data;
</script>

<Toaster richColors position="top-center" />
<svelte:window on:keydown={onKeydown} />
<main class="flex flex-col justify-between h-full">
	<div class="px-4 py-4 bg-gray-200 border-t-2 border-b-2 border-gray-300">
		<p class="pb-2 font-sans font-bold text-gray-500 text-md">
			Puzzle #{data.puzzleNumber}
		</p>
		<h1 class="flex gap-2 font-sans text-2xl font-black uppercase">
			{#each data.pattern as letter}
				<span class="flex items-center justify-center text-white rounded-sm size-12 bg-blue"
					>{letter}</span
				>
			{/each}
		</h1>
	</div>

	<div class="flex-grow overflow-y-auto h-[400px]">
		<WordList pattern={data.pattern} {wordList} />
	</div>

	<div class="w-full h-10 mx-auto border-b border-gray-300 flex-gro">
		<!-- Show the current word being typed -->
		<div class="flex justify-center gap-2 text-xl font-bold uppercase fond-bold">
			{#each currentWord as letter}
				<span>{letter}</span>
			{/each}
		</div>
	</div>
	<div class="px-2 pt-6">
		<Keyboard
			--height="3.5rem"
			--font-family="Open Sans Variable"
			--font-size="16px"
			--font-weight="700"
			--text-transform="uppercase"
			layout="wordle"
			on:keydown={onKeydown}
		/>
	</div>
</main>

<style>
	:global(.svelte-keyboard svg) {
		margin-left: 15px;
	}
	:global(.svelte-keyboard .key.active) {
		background-color: #4a90e2;
		color: white;
	}
</style>
