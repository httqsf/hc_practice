from juice import Juice

class VendingMachine:
    def __init__(self):
        pepsi = Juice("ペプシ", 150)
        monster = Juice("モンスター", 230)
        water = Juice("いろはす", 120)
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
        try:
            suica.pay(price)
            purchased_item = self.pop_item(name)
            self.add_sales(price)
            return purchased_item
        except ValueError:
            raise