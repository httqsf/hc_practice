import { TodolistModel } from "./model/TodolistModel.js";
import { TodoListView } from "./view/TodoListView.js";
import { TodoItemModel } from "./model/TodoItemModel.js";
import { render } from "./view/html_utils.js";

export class App {
    #todolistModel = new TodolistModel();
    #todoListView = new TodoListView();
    #formElement = document.getElementById("js-form");

    /**
     * フォームの送信を処理するハンドラー
     * @param {Event} event 
     */
    #handleSubmit = (event) => {
        event.preventDefault();
        if (inputElement.value.trim() === "") {
            return;
        }
        this.#handleAdd(inputElement.value);
        inputElement.value = "";
    }

    /**
     * TodoItemModelを追加
     * @param {string} title 
     */
    #handleAdd(title){
        this.#todolistModel.addTodo(new TodoItemModel(title, false))
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
    #handleUpdate({id, title,completed}){
        this.#todolistModel.updateTodo({id, title, completed});
    }

    /**
     * タスクカウンターを更新
     */
    #updateTaskCounter = () => {
        const totalCount = this.#todolistModel.getTotalitem();
        const completedCount = this.#todolistModel.getCompletedItem();
        const uncompletedCount = this.#todolistModel.getUncompletedItem();
        
        const counterElement = document.getElementById("js-todo-count");
        counterElement.textContent = `全てのタスク：${totalCount} 完了済み：${completedCount} 未完了：${uncompletedCount}`;
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
        render(todoListElement, containerElement);
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
