import random

members = ["A", "B", "C", "D", "E", "F"]

random.shuffle(members)

if random.choice([True, False]):
    group1 = sorted(members[:2])
    group2 = sorted(members[2:])
else:
    group1 = sorted(members[:3])
    group2 = sorted(members[3:])

print(group1)
print(group2)
