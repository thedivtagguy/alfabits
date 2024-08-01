import { fail } from '@sveltejs/kit';
import { Game } from './game';

// Assume these are imported from elsewhere or defined here
import { words, allowed } from './words.server';

/** @type {import('./$types').PageServerLoad} */
export const load = ({ cookies }) => {
	const game = new Game(cookies.get('sverdle'));
	const answer = words[game.index % words.length]; // Get answer based on game index

	return {
		/**
		 * The player's guessed words so far
		 */
		guesses: game.guesses,
		/**
		 * An array of strings like '__x_c' corresponding to the guesses, where 'x' means
		 * an exact match, and 'c' means a close match (right letter, wrong place)
		 */
		answers: game.answers,
		/**
		 * The correct answer, revealed if the game is over
		 */
		answer: game.isGameOver ? answer : null
	};
};

/** @type {import('./$types').Actions} */
export const actions = {
	/**
	 * Modify game state in reaction to a keypress. If client-side JavaScript
	 * is available, this will happen in the browser instead of here
	 */
	update: async ({ request, cookies }) => {
		const game = new Game(cookies.get('sverdle'));
		const data = await request.formData();
		const key = data.get('key');
		const i = game.guessCount;

		if (key === 'backspace') {
			game.guesses[i] = game.guesses[i]?.slice(0, -1) || '';
		} else if (typeof key === 'string') {
			game.guesses[i] = (game.guesses[i] || '') + key;
		}

		cookies.set('sverdle', game.toString(), { path: '/' });
	},

	/**
	 * Modify game state in reaction to a guessed word. This logic always runs on
	 * the server, so that people can't cheat by peeking at the JavaScript
	 */
	enter: async ({ request, cookies }) => {
		const game = new Game(cookies.get('sverdle'));
		const data = await request.formData();
		const guess = /** @type {string} */ (data.get('guess'));

		if (!guess || guess.length !== 5 || !allowed.has(guess)) {
			return fail(400, { badGuess: true });
		}

		const answer = words[game.index % words.length];
		const evaluation = evaluateGuess(guess, answer);

		game.addGuess(guess, evaluation);
		cookies.set('sverdle', game.toString(), { path: '/' });
	},

	restart: async ({ cookies }) => {
		cookies.delete('sverdle', { path: '/' });
	}
};

/**
 * Evaluate a guess against the answer
 * @param {string} guess
 * @param {string} answer
 * @returns {string}
 */
function evaluateGuess(guess, answer) {
	const result = Array(5).fill('_');
	const available = Array.from(answer);

	// First, find exact matches
	for (let i = 0; i < 5; i++) {
		if (guess[i] === available[i]) {
			result[i] = 'x';
			available[i] = ' ';
		}
	}

	// Then find close matches
	for (let i = 0; i < 5; i++) {
		if (result[i] === '_') {
			const index = available.indexOf(guess[i]);
			if (index !== -1) {
				result[i] = 'c';
				available[index] = ' ';
			}
		}
	}

	return result.join('');
}
