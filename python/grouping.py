import random

MEMBERS = ["A", "B", "C", "D", "E", "F"]

random.shuffle(MEMBERS)

if random.choice([True, False]):
    group1 = sorted(MEMBERS[:2])
    group2 = sorted(MEMBERS[2:])
else:
    group1 = sorted(MEMBERS[:3])
    group2 = sorted(MEMBERS[3:])


print(group1)
print(group2)
