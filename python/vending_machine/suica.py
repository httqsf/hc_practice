class Suica:
    def __init__(self):
        self._balance = 500

    @property
    def balance(self):
        return self._balance

    def charge(self, amount):
        if amount >= 100:
            self._balance += amount
            print(f"{amount}円チャージしました")
            return True
        else:
            print("100円以上のチャージが必要です")
            return False

    def pay(self, amount):
        if self._balance >= amount:
            self._balance -= amount
            print(f"suicaで{amount}円支払いました")
            return True 
        else:
            print("残高が不足しています")
            return False

    
