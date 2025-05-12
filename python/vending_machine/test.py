from vending_machine import VendingMachine
from suica import Suica
from juice import Juice

def test_buy():
    vm = VendingMachine()
    suica1 = Suica()
    
    # Suicaにチャージ
    print("\nチャージ操作:")
    
    try:
        suica1.charge(10)
        print(f"10円チャージしました。残高: {suica1.balance}円")
    except ValueError as e:
        print(e)

    try:
        suica1.charge(1000)
        print(f"1000円チャージしました。残高: {suica1.balance}円")
    except ValueError as e:
        print(e)
    
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
    current_stock = vm.restock_item(Juice("ペプシ", 150), 5)
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