import random
import json
import aiohttp
import asyncio
from collections import Counter

MIN_WORD_COUNT = 30
MIN_SCORE = 100
LETTERS = 'abcdefghijklmnopqrstuvwxyz'
API_LIMIT = 100000
SAFETY_FACTOR = 0.8  
SAVE_INTERVAL = 100  

MAX_ATTEMPTS_PER_PATTERN = 10
MAX_PATTERNS = int((API_LIMIT * SAFETY_FACTOR) / MAX_ATTEMPTS_PER_PATTERN)

print(f"Attempting to generate up to {MAX_PATTERNS} patterns")

async def fetch_words(session, pattern):
    url = f"https://api.datamuse.com/words?sp={pattern}&max=1000"
    async with session.get(url) as response:
        data = await response.json()
        return [item['word'] for item in data if ' ' not in item['word'] and item['score'] >= MIN_SCORE]

async def generate_valid_pattern(session):
    pattern = f"*{random.choice(LETTERS)}{random.choice(LETTERS)}{random.choice(LETTERS)}*"
    words = await fetch_words(session, pattern)
    if len(words) >= MIN_WORD_COUNT:
        return pattern[1:-1], len(words)
    return None, 0

def save_patterns(patterns, filename="valid_patterns.json"):
    with open(filename, "w") as f:
        json.dump(patterns, f, indent=2)
    print(f"Saved {len(patterns)} patterns to {filename}")

async def generate_patterns():
    valid_patterns = set()
    attempts = 0
    max_attempts = MAX_PATTERNS * MAX_ATTEMPTS_PER_PATTERN

    async with aiohttp.ClientSession() as session:
        while len(valid_patterns) < MAX_PATTERNS and attempts < max_attempts:
            pattern, word_count = await generate_valid_pattern(session)
            attempts += 1
            if pattern and pattern not in valid_patterns:
                valid_patterns.add((pattern, word_count))
                print(f"Generated pattern: {pattern} with {word_count} words ({len(valid_patterns)}/{MAX_PATTERNS})")
                
                # Periodically save patterns
                if len(valid_patterns) % SAVE_INTERVAL == 0:
                    patterns_list = [{"pattern": p, "word_count": c} for p, c in valid_patterns]
                    save_patterns(patterns_list, "valid_patterns_partial.json")

    return [{"pattern": p, "word_count": c} for p, c in valid_patterns]

async def main():
    patterns = await generate_patterns()
    
   
    save_patterns(patterns)
    
    # Analysis of generated patterns
    pattern_counts = Counter(p['pattern'] for p in patterns)
    print(f"Number of unique patterns: {len(pattern_counts)}")
    print(f"Most common patterns: {pattern_counts.most_common(5)}")

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nScript interrupted. Partial results have been saved.")
    except Exception as e:
        print(f"An error occurred: {e}")
        print("Partial results may have been saved.")