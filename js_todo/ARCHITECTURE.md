
# 🏗️ js\_todo：Observerパターン実装まとめ

## 1) レイヤーアーキテクチャ図

```mermaid
graph TB
    subgraph "🎮 Controller Layer"
        App[<div style="text-align:left">App<br/>・mount/unmount<br/>・handle*メソッド<br/>・イベント管理</div>]
    end
    
    subgraph "📊 Model Layer"
        EventNotify[<div style="text-align:left">EventNotify<br/>・addEventListener<br/>・notify<br/>・removeEventListener</div>]
        TodoListModel[<div style="text-align:left">TodoListModel<br/>・addTodo<br/>・updateTodo<br/>・deleteTodo<br/>・onChange/offChange</div>]
        TodoItemModel[<div style="text-align:left">TodoItemModel<br/>・id<br/>・title<br/>・completed</div>]
    end
    
    subgraph "🖼️ View Layer"
        TodoListView[<div style="text-align:left">TodoListView<br/>・createElement<br/>・子View統合</div>]
        TodoItemView[<div style="text-align:left">TodoItemView<br/>・createElement<br/>・ユーザー操作受付</div>]
        htmlUtil[<div style="text-align:left">html-utils<br/>・element<br/>・render<br/>・escapeSpecialChars</div>]
    end
    
    subgraph "🌐 Entry Point"
        indexJS[<div style="text-align:left">index.js<br/>・App起動</div>]
        indexHTML[<div style="text-align:left">index.html<br/>・DOM構造</div>]
    end

    %% 継承関係
    TodoListModel -.->|extends| EventNotify
    
    %% 依存関係
    App --> TodoListModel
    App --> TodoListView
    TodoListModel --> TodoItemModel
    TodoListView --> TodoItemView
    TodoItemView --> htmlUtil
    TodoListView --> htmlUtil
    
    %% エントリーポイント
    indexJS --> App
    indexHTML --> App
    
    %% スタイル
    classDef controller fill:#e1f5fe,stroke:#0288d1,stroke-width:1px
    classDef model fill:#f3e5f5,stroke:#6a1b9a,stroke-width:1px
    classDef view fill:#e8f5e9,stroke:#2e7d32,stroke-width:1px
    classDef entry fill:#fff3e0,stroke:#ef6c00,stroke-width:1px
    
    class App controller
    class EventNotify,TodoListModel,TodoItemModel model
    class TodoListView,TodoItemView,htmlUtil view
    class indexJS,indexHTML entry
```

--- 

### クラス図

```mermaid
classDiagram
    direction LR

    class App {
        - todolistModel : TodoListModel
        - todoListView : TodoListView
        - formElement : HTMLFormElement
        - inputElement : HTMLInputElement
        - containerElement : HTMLElement
        + mount()
        - handleAdd(title)
        - handleSubmit(event)
        - handleDelete(id)
        - handleUpdate(id, title, completed)
        - updateTaskCounter()
        - modelChangeHandler()
    }

    class TodoListModel {
        - Items : TodoItemModel[]
        + constructor(items)
        + getItems()
        + getItemCount() : number
        + getCompletedItemCount() : number
        + getUncompletedItemCount() : number
        + onChange(listener)
        + addTodo(todoItem)
        + updateTodo(id, title, completed)
        + deleteTodo(id)
    }

    class EventNotify {
        + addEventListener(eventName, listener)
        + removeEventListener(eventName, listener)
        + notify(eventName)
    }

    class TodoItemModel {
        + id : number
        + title : string
        + completed : boolean
        + constructor(title, completed)
    }

    class TodoListView {
        + createElement(todoItems, eventHandlers) : Element
    }

    class TodoItemView {
        + createElement(todoItem, handlers) : Element
    }

    class html_utils {
        + escapeSpecialChars(str) : string
        + htmlToElement(html) : Element
        + element(strings, values) : Element
        + render(bodyElement, containerElement)
    }

    App --> TodoListModel
    App --> TodoListView
    TodoListModel --> TodoItemModel
    TodoListModel --|> EventNotify
    TodoListView --> TodoItemView
    TodoItemView --> html_utils
    TodoListView --> html_utils
    App --> html_utils
```

---

## 2) データフロー（イベント→モデル→通知→ビュー更新）

```mermaid
sequenceDiagram
    participant User as 👤 User
    participant DOM as DOM Event
    participant App as 🎮 App (Controller)
    participant Model as 📊 TodoListModel (Model)
    participant Observer as 📡 EventNotify (Observer)
    participant View as 🖼️ TodoListView / TodoItemView
    participant Utils as 🔧 html_utils
    participant Browser as 🌐 DOM

    User ->> DOM: 入力/クリック
    DOM ->> App: submit / change / click
    App ->> Model: addTodo / updateTodo / deleteTodo
    Model ->> Observer: notify("change")
    Observer ->> App: modelChangeHandler()
    App ->> Model: getItems()
    App ->> View: createElement(todoItems, handlers)
    View ->> Utils: element()
    App ->> Utils: render(newList, container)
    Utils ->> Browser: DOM差し替え
    App ->> App: updateTaskCounter()
```

---

## 3) ファイル責務マップ（どのファイルが何を担当？）

```mermaid
flowchart LR
  subgraph Entry/UI Shell
    A[index.html]:::file -->|DOM要素提供| B[index.js]:::file
    A --> S(style.css):::file
  end

  subgraph Controller
    C[src/App.js]:::file
  end

  subgraph Model
    M1[src/model/TodoListModel.js]:::file
    M2[src/model/TodoItemModel.js]:::file
    EN[src/EventNotify.js]:::file
  end

  subgraph View
    V1[src/view/TodoListView.js]:::file
    V2[src/view/TodoItemView.js]:::file
    U[src/view/html_utils.js]:::file
  end

  B --> C
  C --> M1
  M1 --> EN
  M1 --> M2
  C --> V1
  V1 --> V2
  V1 --> U
  V2 --> U
  C --> U
  U --> A

  classDef file fill:#eef,stroke:#6b7,stroke-width:1px,color:#111;
```

### 各ファイルの役割と主な処理

* **`index.html`**

  * 画面の骨組み（フォーム、入力、リスト、フッター）を提供
  * `id="js-form"`, `id="js-form-input"`, `id="js-todo-list"`, `id="js-todo-count"` を **JSが取得**して使う
* **`style.css`**

  * 見た目の定義（フォーム、リスト、ホバー、レスポンシブ）
  * `.todo-item`, `.checkbox`, `.todo-text`, `.edit/.delete/.save/.cancel` などのスタイル
* **`index.js`**

  * `new App()` を作成し、`window.load` で `app.mount()` 実行
* **`src/App.js`（Controller）**

  * DOMイベントを受けて、**Modelに処理を委譲**
  * **Modelの変更通知**を購読して **Viewを再描画**
  * 追加（`#handleAdd`）／更新（`#handleUpdate`）／削除（`#handleDelete`）の**ハンドラ**を持つ
  * `#modelChangeHandler` で `TodoListView.createElement()` → `render()` 差し替え → カウンター更新
* **`src/model/TodoListModel.js`（Model + Observer継承）**

  * `EventNotify` を継承、**状態管理**と **変更通知（notify("change")）** を担う
  * `#Items`に`TodoItemModel`配列を保持、`add/update/delete`で状態変更
  * `onChange(listener)` でリスナ登録（App側が登録）
* **`src/model/TodoItemModel.js`（Entity）**

  * 1件のTodoを表現（`id`, `title`, `completed`）
  * コンストラクタでID採番
* **`src/EventNotify.js`（Observer基盤）**

  * `addEventListener/removeEventListener/notify` を提供（Modelが継承して利用）
* **`src/view/TodoListView.js`（View：リスト）**

  * `createElement(todoItems, handlers)` で `ul` を作成し、各アイテムを `TodoItemView` に委譲
* **`src/view/TodoItemView.js`（View：項目）**

  * `createElement(todoItem, {onUpdateTodo, onDeleteTodo})`
  * チェックボックス（完了/未完了）、編集/保存/キャンセル、削除ボタンの**UIとイベント**
* **`src/view/html_utils.js`（Utility）**

  * `element`（タグ付きテンプレート）で **XSS対策付き**のDOM生成
  * `render` で **コンテナの中身を差し替え**（再描画の要）

---

## 4) コードに即した補足説明（必要な処理・注意点）

### (A) Controller ↔ Model ↔ View の結線

* `App.mount()` で

  1. **Modelの変更通知**を購読：`todolistModel.onChange(this.#modelChangeHandler)`
  2. **フォーム送信**イベントを購読：`form.addEventListener("submit", this.#handleSubmit)`
* 追加・更新・削除の各ハンドラは **Modelメソッド** (`addTodo/updateTodo/deleteTodo`) を呼ぶだけに徹し、**ビジネスロジックはModel側**に集約。
* Modelは状態変化のたびに `notify("change")`。それを受けた `#modelChangeHandler()` が **Viewを再構築→renderで差し替え**→**タスク数更新** の順に処理。

### (B) Viewの安全なDOM生成

* `html_utils.element` は **文字列値だけエスケープ**するため、XSSリスクを軽減。テンプレート上で外部入力を埋め込むのに適切。
* 再描画は `render(newList, container)` の**丸ごと差し替え**で実装シンプルに。

### (C) 編集UIのふるまい（改善ポイント付き）

* `TodoItemView` の「編集」「保存」「キャンセル」を切り替えて表示。
* **改善提案**：キャンセル時は編集UIを閉じて元の値に戻すだけにし、`onUpdateTodo` を呼ばない方が直感的（現在は呼んで元の値を再適用している）。

### (D) 進捗カウンターの命名整合

* `App.#updateTaskCounter()` 側で呼んでいる集計メソッド名と、Modelの実装名に**差異**があるとバグの温床に。

  * **推奨統一名（Model）**：`getItemCount()` / `getCompletedItemCount()` / `getUncompletedItemCount()`
  * **App側も同名に合わせる**のが安全。

---

## 5) 典型ユースケース別の変更指針

### 5-1) データ構造の追加（例：優先度 priority）

* 変更：`TodoItemModel` に `priority` 追加
* 表示：`TodoItemView` に表示/編集UIを追加
* ロジック（任意）：`TodoListModel` にソートやフィルタを追加
* Controller：入力値の受け渡し・検証を追加

### 5-2) 表示機能の追加（例：カレンダー表示）

* 新View `TodoCalendarView` を追加し、`App` が表示切替を管理
* Model/Entity は既存のままでもOK（表示のみ拡張）

### 5-3) ビジネスロジックの追加（例：期限切れ警告）

* `TodoItemModel` に `deadline` 追加
* `TodoListModel` に期限チェック・警告判定
* `TodoItemView` が期限切れ表現（色/バッジ）
* `App` はトリガー＆UI反映

---

## 6) 「どのクラスを変更すべき？」チェックリスト

```mermaid
flowchart TB
    A[変更点は何？] --> B{データ構造が変わる?}
    B -->|YES| M1[TodoItemModel]
    B -->|NO| C{ビジネスルールが変わる?}
    C -->|YES| M2[TodoListModel]
    C -->|NO| D{表示方法が変わる?}
    D -->|YES| V[View層]
    D -->|NO| E{操作方法が変わる?}
    E -->|YES| AV[App + View]
    E -->|NO| F{新機能?}
    F -->|YES| NEW[新クラス検討]
    F -->|NO| DONE[現状維持]
```


## 7) まとめ

* \*\*イベントはController（App）\*\*が受け、**Modelに依頼** → **ModelがObserverで通知** → **AppがViewを再描画**。
* **表示はView、状態はModel、橋渡しはApp**に厳密分離。
* 再描画は `render()` の全差し替えでシンプル＆安全。
* ユニット変更も「どこを触るか」が明確で、拡張しやすい構造です。

---

### おまけ（思考トレーニング）

\*\*「ドラッグ&ドロップで並び替え」\*\*を入れるなら：

* 表示側：`TodoListView/TodoItemView` に DnD ハンドラ
* データ側：`TodoListModel` に `reorder(fromIndex, toIndex)`
* App：DnDの結果を受けて `reorder` を実行 → `notify("change")` → 再描画

---
