export const prerender = true;

export async function load({ fetch }) {
	const response = await fetch('/.netlify/functions/fetch-word');
	const data = await response.json();
	return {
		pattern: data.pattern,
		wordCount: data.wordCount,
		puzzleNumber: data.puzzleNumber
	};
}
