class Suica:
    def __init__(self):
        self._balance = 500

    @property
    def balance(self):
        return self._balance

    def charge(self, amount):
        if amount >= 100:
            self._balance += amount
            return True
        else:
            return False

    def pay(self, amount):
        if self._balance >= amount:
            self._balance -= amount
            return True 
        else:
            return False

    
