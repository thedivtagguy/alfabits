# Filter those patterns that have less than 100 words

import json

with open('src/lib/assets/valid_patterns.json', 'r') as f:
    data = json.load(f)

filtered_data = [pattern for pattern in data if pattern['word_count'] >= 100]

# Write to src/lib/assets/valid_patterns.json
with open('src/lib/assets/patterns.json', 'w') as f:
    json.dump(filtered_data, f)