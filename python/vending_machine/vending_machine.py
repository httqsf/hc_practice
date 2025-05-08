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
        return len(self._items[juice.name])
    
    def pop_item(self, name):
        if self.has_item(name):
            return self._items[name].pop(0)
        return None
    
    def add_sales(self, quantity):
        self._sales += quantity

    def buy(self, suica, name):
        if not self.has_item(name):
            return None
            
        price = self.get_item_price(name)
        if suica.pay(price):
            self.pop_item(name)
            self.add_sales(price)
            return True
        return False

def test_buy():
    vm = VendingMachine()
    suica1 = suica.Suica()
    
    # Suicaにチャージ
    print("\nチャージ操作:")
    if suica1.charge(10):
        print(f"10円チャージしました。残高: {suica1.balance}円")
    else:
        print("チャージに失敗しました")
    
    if suica1.charge(1000):
        print(f"1000円チャージしました。残高: {suica1.balance}円")
    else:
        print("チャージに失敗しました")
    
    # ペプシを購入
    print("\nペプシの購入:")
    result = vm.buy(suica1, "ペプシ")
    if result is None:
        print("ペプシは売り切れです")
    elif result:
        print("ペプシを購入しました")
        print(f"在庫: {len(vm.items['ペプシ'])}個")
        print(f"残高: {suica1.balance}円")
        print(f"売上: {vm.sales}円")
    else:
        print("ペプシを購入できませんでした")
    
    # 在庫補充
    print("\n在庫補充:")
    current_stock = vm.restock_item(juice.Juice("ペプシ", 150), 5)
    print(f"ペプシが5個追加されました")
    print(f"現在の在庫: {current_stock}個")
    
    # 商品ラインナップの確認
    print(f"\n購入可能なラインナップ: {vm.get_item_names()}")
    
    # いろはすを購入
    print("\nいろはすの購入:")
    result = vm.buy(suica1, "いろはす")
    if result is None:
        print("いろはすは売り切れです")
    elif result:
        print("いろはすを購入しました")
        print(f"在庫: {len(vm.items['いろはす'])}個")
        print(f"残高: {suica1.balance}円")
        print(f"売上: {vm.sales}円")
    else:
        print("いろはすを購入できませんでした")

if __name__ == "__main__":
    test_buy()