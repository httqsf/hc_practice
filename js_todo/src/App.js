import { TodoListModel } from "./model/TodoListModel.js";
import { TodoListView } from "./view/TodoListView.js";
import { TodoItemModel } from "./model/TodoItemModel.js";
import { render } from "./view/html_utils.js";

export class App {
    #todolistModel = new TodoListModel();
    #todoListView = new TodoListView();
    #formElement = document.getElementById("js-form");
    #inputElement = document.getElementById("js-form-input");
    #containerElement = document.getElementById("js-todo-list");
    #counterElement = document.getElementById("js-todo-count");
    #editingIds = new Set();
    
    /**
     * TodoItemModelを追加
     * @param {string} title 
     */
    #handleAdd(title){
        this.#todolistModel.addTodo(new TodoItemModel(title, false))
    }

    /**
     * フォームの送信を処理するハンドラー
     * @param {Event} event 
     */
    #handleSubmit = (event) => {
        event.preventDefault();
        const inputValue = this.#inputElement.value.trim();
        if (inputValue === "") return;
        this.#handleAdd(inputValue);
        this.#inputElement.value = "";
    }


    /**
     * TodoItemModelを削除
     * @param {{id: number}} 
     */
    #handleDelete({id}){
        // ビジネスロジック: 削除の確認
        if (confirm("本当によろしいですか？")) {
            this.#todolistModel.deleteTodo({id});
        }
    }

    /**
     * TodoItemModelを更新
     * @param {{id: number, title: string, completed: boolean}} 
     */
    #handleUpdate({id, title, completed}){
        const titleValue = title.trim();
        if (titleValue === "") return;
        this.#todolistModel.updateTodo({id, title: titleValue, completed});
    }

    /**
     * タスクカウンターを更新
     */
    #updateTaskCounter = () => {
        const totalCount = this.#todolistModel.getItemCount();
        const completedCount = this.#todolistModel.getCompletedItemCount();
        const uncompletedCount = this.#todolistModel.getUncompletedItemCount();
        this.#counterElement.textContent = `全てのタスク：${totalCount} 完了済み：${completedCount} 未完了：${uncompletedCount}`;
    }

    /**
     * 編集を開始
     */
    #handleEditStart = ({ id }) => {
        this.#editingIds.add(id);
        this.#renderView();
    }

    /**
     * 編集を終了
     */
    #handleEditFinish = ({ id, title, completed }) => {
        const titleValue = title.trim();
        if (titleValue === "") {
            this.#renderView();
            return;
        }
        this.#editingIds.delete(id);
        this.#handleUpdate({id, title: titleValue, completed});
    }

    /**
     * 編集をキャンセル
     */
    #handleEditCancel = ({ id }) => {
        this.#editingIds.delete(id);
        this.#renderView();
    }

    /**
     * Todolistが変更されたときに呼ばれるハンドラー
     */
    #modelChangeHandler = () => {
        this.#renderView();
    }

    /**
     * ビューを描画
     */
    #renderView = () => {
        const todoItems = this.#todolistModel.getItems();
        const todoListElement = this.#todoListView.createElement(todoItems, {
            onUpdateTodo: ({id, title, completed}) => {
                this.#handleUpdate({id, title, completed});
            },
            onDeleteTodo: ({id}) => {
                this.#handleDelete({id});
            },
            onStartEdit: ({id}) => {
                this.#handleEditStart({id});
            },
            onFinishEdit: ({id, title, completed}) => {
                this.#handleEditFinish({id, title, completed});
            },
            onCancelEdit: ({id}) => {
                this.#handleEditCancel({id});
            },
            isEditing: (id) => this.#editingIds.has(id)
        });
        render(todoListElement, this.#containerElement);
        this.#updateTaskCounter();
    }

    /**
     * Appをマウント
     */
    mount(){
        this.#todolistModel.onChange(this.#modelChangeHandler);
        this.#formElement.addEventListener("submit", this.#handleSubmit);
    }
}
