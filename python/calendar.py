import argparse
import datetime

MONTH_NAME = {1: "January", 2: "February", 3: "March", 4: "April", 5: "May", 6: "June", 7: "July", 8: "August", 9: "September", 10: "October", 11: "November", 12: "December"}
WEEK_NAME = ["月", "火", "水", "木", "金", "土", "日"]

def get_options():
    """
    コマンドライン引数を解析する関数
    Returns:
        argparse.Namespace: コマンドライン引数
    """
    parser = argparse.ArgumentParser()
    today = datetime.date.today()
    parser.add_argument("-m", type=int, default=today.month)
    parser.add_argument("-y", type=int, default=today.year)
    args = parser.parse_args()
    return args

def get_days_in_month(year, month):
    """
    指定された年と月の日数を返す関数
    Args:
        year (int): 年
        month (int): 月
    Returns:
        int: 指定された年と月の日数 
    """

    next_month      = (month % 12) + 1
    next_month_year = year + (month == 12)

    first_day_of_next_month = datetime.date(next_month_year, next_month, 1)
    last_day_of_month = first_day_of_next_month - datetime.timedelta(days=1)
    
    return last_day_of_month.day


def validate_month(month):
    """
    指定された月が有効かどうかを確認する関数
    Args:
        month (int): 月
    Returns:
        bool: True:有効, False:無効
    """
    return 1 <= month <= 12
    
def validate_year(year):
    """
    指定された年が有効かどうかを確認する関数
    Args:
        year (int): 年
    Returns:
        bool: True:有効, False:無効
    """
    return 1 <= year <= 9999

def print_calendar(month, year):
    """
    指定された年と月のカレンダーを表示する関数
    Args:
        month (int): 月
        year (int): 年
    """
    if not validate_month(month):
        return print("有効な月を指定してください（1〜12）")
    elif not validate_year(year):
        return print("有効な年を指定してください（1〜9999）")

    first_day = datetime.date(year, month, 1)
    first_day_weekday = first_day.weekday()
    
    days_count = get_days_in_month(year, month)
    date_display = "   " * first_day_weekday
    current_weekday = first_day_weekday
    
    for day in range(1, days_count + 1):
        # 日付が1桁表示の場合は前にもスペースを追加して揃える
        date_display += f" {day} " if day < 10 else f"{day} "
        
        current_weekday += 1
        
        if current_weekday == 7:
            current_weekday = 0
            date_display += "\n"

    print(f"{MONTH_NAME[month]} {year}")
    print(f"{' '.join(WEEK_NAME)}")
    print(date_display)


if __name__ == "__main__":
    args = get_options()
    print_calendar(args.m, args.y)