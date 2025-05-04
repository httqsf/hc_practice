import sys

GOLF_SCORE_NAMES = {
    -999: "ホールインワン",
    -4: "コンドル",
    -3: "アルバトロス",
    -2: "イーグル",
    -1: "バーディ",
    0: "パー",
    1: "ボギー",
}

def read_input():
    lines = [line.strip() for line in sys.stdin]
    return lines

def parse_input(lines):
    regulation_counts = list(map(int, lines[0].split(",")))
    scores           = list(map(int, lines[1].split(",")))
    return regulation_counts, scores

def calculate_score(regulation_counts, scores):
    result_list = []
    for round, regulation in enumerate(regulation_counts):
        result_list.append(get_score_name(scores[round], regulation))
    return result_list

def get_score_name(score, regulation):
    if score == 1:
        if regulation == 5:
            return GOLF_SCORE_NAMES[-4]
        return GOLF_SCORE_NAMES[-999]
    
    diff = score - regulation
    if diff >= 2:
        return f"{diff}{GOLF_SCORE_NAMES[1]}"
    return GOLF_SCORE_NAMES[diff]

if __name__ == "__main__":
    lines = read_input()
    regulation_counts, scores = parse_input(lines)
    result_list = calculate_score(regulation_counts, scores)
    print(",".join(result_list))

