import json

with open("trials.json", "r") as f:
    data = json.load(f)

with open("mytrials.js", "w") as f:
    f.write("const prime_probe_trials = ")
    json.dump(data, f, indent=2)
    f.write(";\n")

print("mytrials.js generated.")