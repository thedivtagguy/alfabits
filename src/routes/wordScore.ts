interface WordScore {
	word: string;
	totalScore: number;
	breakdown: {
		positionScore: number;
		letterValueSum: number;
		lengthScore: number;
		rarityBonus: number;
	};
}

interface DatamuseResponse {
	word: string;
	score: number;
}

/**
 * Calculates a score for a given word based on various criteria.
 * @param SEQUENCE - The required sequence that must be present in the word.
 * @param word - The word to be scored.
 * @returns A Promise that resolves to a WordScore object.
 * @throws Error if the word is invalid or doesn't contain the required sequence.
 */
async function calculateWordScore(SEQUENCE: string, word: string): Promise<WordScore> {
	const lowercaseWord = word.toLowerCase();
	const lowercaseSequence = SEQUENCE.toLowerCase();

	if (!lowercaseWord.includes(lowercaseSequence)) {
		throw new Error('Word does not contain the required sequence');
	}

	const data = await validateWord(word);
	const apiScore = data[0].score;

	const positionScore = calculatePositionScore(lowercaseWord, lowercaseSequence);
	const letterValueSum = calculateLetterValueSum(lowercaseWord);
	const lengthScore = calculateLengthScore(word.length, SEQUENCE.length);
	const rarityBonus = calculateRarityBonus(apiScore);

	const totalScore = positionScore + letterValueSum + lengthScore + rarityBonus;

	return {
		word,
		totalScore,
		breakdown: {
			positionScore,
			letterValueSum,
			lengthScore,
			rarityBonus
		}
	};
}

/**
 * Validates the word using the Datamuse API.
 * @param word - The word to validate.
 * @returns A Promise that resolves to an array of DatamuseResponse objects.
 * @throws Error if the word is invalid.
 */
async function validateWord(word: string): Promise<DatamuseResponse[]> {
	const response = await fetch(`https://api.datamuse.com/words?sp=${word}&max=1`);
	const data: DatamuseResponse[] = await response.json();

	if (data.length === 0 || data[0].word.toLowerCase() !== word.toLowerCase()) {
		throw new Error('Invalid word');
	}

	return data;
}

/**
 * Calculates the position score based on where the sequence appears in the word.
 * @param word - The lowercase word.
 * @param sequence - The lowercase sequence.
 * @returns The position score.
 */
function calculatePositionScore(word: string, sequence: string): number {
	const sequenceIndex = word.indexOf(sequence);
	if (sequenceIndex === 0) {
		return 50; // Start of word
	} else if (sequenceIndex === word.length - sequence.length) {
		return 30; // End of word
	} else {
		return 20; // Middle of word
	}
}

/**
 * Calculates the sum of letter values based on Scrabble-style scoring.
 * @param word - The lowercase word.
 * @returns The sum of letter values.
 */
function calculateLetterValueSum(word: string): number {
	const letterValues: { [key: string]: number } = {
		a: 1,
		b: 3,
		c: 3,
		d: 2,
		e: 1,
		f: 4,
		g: 2,
		h: 4,
		i: 1,
		j: 8,
		k: 5,
		l: 1,
		m: 3,
		n: 1,
		o: 1,
		p: 3,
		q: 10,
		r: 1,
		s: 1,
		t: 1,
		u: 1,
		v: 4,
		w: 4,
		x: 8,
		y: 4,
		z: 10
	};
	return word.split('').reduce((sum, letter) => sum + (letterValues[letter] || 0), 0);
}

/**
 * Calculates the length score based on the word length and sequence length.
 * @param wordLength - The length of the word.
 * @param sequenceLength - The length of the required sequence.
 * @returns The length score.
 */
function calculateLengthScore(wordLength: number, sequenceLength: number): number {
	const extraLetters = wordLength - sequenceLength;
	if (extraLetters <= 0) {
		return -50; // Penalty for words that are just the sequence
	} else if (extraLetters <= 2) {
		return 0; // No bonus for words only slightly longer than the sequence
	} else {
		return Math.min((extraLetters - 2) * 15, 100); // Bonus capped at 100
	}
}

/**
 * Calculates the rarity bonus based on the Datamuse API score.
 * @param apiScore - The score from the Datamuse API.
 * @returns The rarity bonus.
 */
function calculateRarityBonus(apiScore: number): number {
	return Math.round(1000000 / apiScore);
}

export { calculateWordScore };
