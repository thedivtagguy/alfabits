import validPatterns from '../../../src/lib/assets/patterns.json';

// Define a start date for the puzzles
const START_DATE = new Date('2024-09-01T00:00:00');

export const handler = async () => {
	const today = new Date();
	const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
	const { pattern, word_count } = validPatterns[seed % validPatterns.length];

	// Calculate the number of days since the start date
	const puzzleNumber =
		Math.floor((today.getTime() - START_DATE.getTime()) / (1000 * 60 * 60 * 24)) + 1;

	return {
		statusCode: 200,
		body: JSON.stringify({ pattern, wordCount: word_count, puzzleNumber })
	};
};
