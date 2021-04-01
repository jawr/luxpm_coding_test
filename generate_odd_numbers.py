import json
numbers = [n for n in range(40) if n % 2 == 1]
print(json.dumps(numbers))
