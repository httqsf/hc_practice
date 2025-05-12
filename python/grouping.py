import random

MEMBERS = ["A", "B", "C", "D", "E", "F"]

random.shuffle(MEMBERS)

num = random.choice([3, 2])
group1 = sorted(MEMBERS[:num])
group2 = sorted(MEMBERS[num:])

print(group1)
print(group2)
