import { TodolistModel } from "./model/TodoListModel.js";
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
        console.log("Adding todo:", title); // デバッグ用
        this.#todolistModel.addTodo(new TodoItemModel(title, false))
    }

    /**
     * 
     * @param {{id: number}} id 
     */
    handleDelete({id}){
        this.#todolistModel.deleteTodo({id})
    }

    handleUpdate({id, completed}){
        this.#todolistModel.updateTodo({id, completed})
    }
    
    /**
     * Appをマウント
     */
    mount(){
        this.#formElement = document.getElementById("js-form");
        const inputElement = document.getElementById("js-form-input");
        const containerElement = document.getElementById("js-todo-list");

        this.#modelChangeHandler = () => {
            console.log("Model change handler called"); // デバッグ用
            const todoItems = this.#todolistModel.getItems();
            console.log("Todo items:", todoItems); // デバッグ用
            const todoListElement = this.#todoListView.createElement(todoItems, {
                onUpdateTodo: ({id, completed}) => {
                    this.handleUpdate({id, completed});
                },
                onDeleteTodo: ({id}) => {
                    this.handleDelete({id});
                }
            });
            render(todoListElement, containerElement);
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
    }
}
