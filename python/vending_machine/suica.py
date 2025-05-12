class Suica:
    def __init__(self):
        self._balance = 500

    @property
    def balance(self):
        return self._balance

    def charge(self, amount):
        if amount <= 100:
            raise ValueError("100円以上のチャージが必要です")
        self._balance += amount

    def pay(self, amount):
        if self._balance < amount:
            raise ValueError("残高が不足しています")
        self._balance -= amount

    
