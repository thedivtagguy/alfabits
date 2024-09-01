<script lang="ts">
	export let pattern: string;
	import { fade } from 'svelte/transition';
	import { fly } from 'svelte/transition';
	export let wordList: { word: string; score: number }[];

	function getLetterClass(word: string, letter: string, index: number): string {
		let patternIndex = 0;
		for (let i = 0; i <= index; i++) {
			if (word[i] === pattern[patternIndex]) {
				patternIndex++;
			}
		}

		if (patternIndex > 0 && letter === pattern[patternIndex - 1]) {
			return 'bg-orange text-white';
		}

		return 'bg-gray-200 text-gray-600';
	}
</script>

<div class="m-3 overflow-hidden word-list">
	<ul class="space-y-2 font-sans font-bold uppercase">
		{#each wordList as { word, score }}
			<li
				in:fly={{ x: -50 }}
				class="flex items-center justify-between h-12 border border-gray-300 rounded-md"
			>
				<div class="flex items-center flex-1 w-16 h-full overflow-x-scroll word-container">
					{#each word.split('') as letter, index}
						<span
							class="flex items-center justify-center h-full aspect-square {getLetterClass(
								word,
								letter,
								index
							)}">{letter}</span
						>
					{/each}
				</div>
				<span
					class="flex items-center justify-center w-12 h-full ml-3 text-xs text-center text-gray-600 border-l border-gray-300 whitespace-nowrap"
				>
					+ {score}
				</span>
			</li>
		{/each}
	</ul>
</div>

<style>
	li {
		font-size: clamp(0.5rem, 20vh, 1.5rem);
	}

	li > div {
		gap: 1px;
	}

	li > div > span {
		aspect-ratio: 1;
	}
</style>
