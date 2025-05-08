import juice
import suica

class VendingMachine:
    def __init__(self):
        pepsi = juice.Juice("ペプシ", 150)
        monster = juice.Juice("モンスター", 230)
        water = juice.Juice("いろはす", 120)
        self._items = {
            pepsi.name:[pepsi for _ in range(5)],
            monster.name:[monster for _ in range(5)],
            water.name:[water for _ in range(5)]
            }
        self._sales = 0

    @property
    def items(self):
        return self._items
    
    @property
    def sales(self):
        return self._sales
 
    def has_item(self, name):
        return name in self._items and len(self._items[name]) > 0
    
    def get_item_price(self, name):
        if self.has_item(name):
            return self._items[name][0].price
        return None
    
    def get_item_names(self):
        return list(self._items.keys())

    def restock_item(self, juice, quantity):
        if self.has_item(juice.name):
            self._items[juice.name].extend([juice for _ in range(quantity)])
        else:
            self._items[juice.name] = [juice for _ in range(quantity)]
        print(f"{juice.name}が{quantity}個追加されました")
    
    def pop_item(self, name):
        if self.has_item(name):
            return self._items[name].pop(0)
        return None
    
    def add_sales(self, quantity):
        self._sales += quantity

    def buy(self, suica, name):
        if not self.has_item(name):
            print(f"{name}は売り切れです")
            return False
            
        price = self.get_item_price(name)
        if suica.balance >= price:
            suica.pay(price)
            self.pop_item(name)
            self.add_sales(price)
            print(f"{name}が購入されました")
            print(f"在庫: {len(self._items[name])}")
            return True
        else:
            print(f"{name}を購入できませんでした")
            return False

def test_buy():
    vm = VendingMachine()
    suica1 = suica.Suica()
    suica1.charge(10)
    suica1.charge(1000)
    vm.buy(suica1, "ペプシ")
    print(f"残高: {suica1.balance}")
    print(f"売上: {vm.sales}")
    vm.restock_item(juice.Juice("ペプシ", 150), 5)
    print(f"購入可能なラインナップ: {vm.get_item_names()}")
    vm.buy(suica1, "いろはす")
    print(f"残高: {suica1.balance}")
    print(f"売上: {vm.sales}")

if __name__ == "__main__":
    test_buy()