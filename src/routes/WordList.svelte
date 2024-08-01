<script>
	import { fade, fly } from 'svelte/transition';

	export let pattern;
	export let words;

	function highlightWord(word) {
		let patternIndex = 0;
		let result = word.split('').map((letter) => ({ letter, class: 'other' }));

		// Find the first occurrence of the complete pattern
		let startIndex = word.toLowerCase().indexOf(pattern.toLowerCase());

		if (startIndex !== -1) {
			for (let i = 0; i < pattern.length; i++) {
				result[startIndex + i].class = 'pattern';
			}
		}

		return result;
	}
</script>

<div class="word-list">
	{#each words as word (word)}
		<div class="word" in:fly={{ y: 50, duration: 300 }} out:fade>
			{#each highlightWord(word) as { letter, class: className }}
				<span class={className}>{letter}</span>
			{/each}
		</div>
	{/each}
</div>

<style>
	.word-list {
		max-height: 300px;
		overflow-y: auto;
		border: 1px solid #ccc;
		border-radius: 5px;
		padding: 10px;
		margin-bottom: 20px;
	}
	.word {
		margin-bottom: 5px;
		font-size: 1.2em;
	}
	.pattern {
		color: #8a2be2;
		font-weight: bold;
	}
	.other {
		color: #ffd700;
	}
</style>
