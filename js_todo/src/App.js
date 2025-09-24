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
     * Todolistが変更されたときに呼ばれるハンドラー
     */
    #modelChangeHandler = () => {
        const todoItems = this.#todolistModel.getItems();
        const todoListElement = this.#todoListView.createElement(todoItems, {
            onUpdateTodo: ({id, title, completed}) => {
                this.#handleUpdate({id, title, completed});
            },
            onDeleteTodo: ({id}) => {
                this.#handleDelete({id});
            },
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
