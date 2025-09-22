import { TodolistModel } from "./model/TodolistModel.js";
import { TodoListView } from "./view/TodoListView.js";
import { TodoItemModel } from "./model/TodoItemModel.js";
import { render } from "./view/html_utils.js";

export class App {
    #todolistModel = new TodolistModel();
    #todoListView = new TodoListView();
    #formElement = null;
    #formSubmitHandler = null;
    #modelChangeHandler = null;

    handleAdd(title){
        this.#todolistModel.addTodo(new TodoItemModel(title, false))
    }

    /**
     * 
     * @param {{id: number}} id 
     */
    handleDelete({id}){
        // ビジネスロジック: 削除の確認
        if (confirm("本当によろしいですか？")) {
            this.#todolistModel.deleteTodo({id});
        }
    }

    handleUpdate({id, completed}){
        this.#todolistModel.updateTodo({id, completed});
    }


    updateTaskCounter(){
        const totalCount = this.#todolistModel.getTotalitem();
        const completedCount = this.#todolistModel.getCompletedItem().length;
        const uncompletedCount = this.#todolistModel.getUncompletedItem().length;
        
        const counterElement = document.getElementById("js-todo-count");
        counterElement.textContent = `全てのタスク：${totalCount} 完了済み：${completedCount} 未完了：${uncompletedCount}`;
    }

    /**
     * Appをマウント
     */
    mount(){
        this.#formElement = document.getElementById("js-form");
        const inputElement = document.getElementById("js-form-input");
        const containerElement = document.getElementById("js-todo-list");

        this.#modelChangeHandler = () => {
            const todoItems = this.#todolistModel.getItems();
            const todoListElement = this.#todoListView.createElement(todoItems, {
                onUpdateTodo: ({id, completed}) => {
                    this.handleUpdate({id, completed});
                },
                onDeleteTodo: ({id}) => {
                    this.handleDelete({id});
                }
            });
            render(todoListElement, containerElement);
            this.updateTaskCounter();
        }
        this.#formSubmitHandler = (event) => {
            event.preventDefault();
            if (inputElement.value.trim() === "") {
                return;
            }
            this.handleAdd(inputElement.value);
            inputElement.value = "";
        }
        this.#todolistModel.onChange(this.#modelChangeHandler);
        this.#formElement.addEventListener("submit", this.#formSubmitHandler);
        
        // 初期表示時にカウンターを更新
        this.updateTaskCounter();
    }
}
