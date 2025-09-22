import { element } from "./html_utils.js";
import { TodoItemModel } from "../model/TodoItemModel.js";
export class TodoItemView {
    /**
     * `todoItem`に対応するTodoアイテムのHTML要素を作成して返す
     * @param {TodoItemModel} todoItem TodoItemModel
     * @param {function({id:number, completed: boolean})} onUpdateTodo チェックボックスの更新イベントリスナー
     * @param {function({id:number})} onDeleteTodo 削除ボタンのクリックイベントリスナー
     * @returns {Element}
     */
    createElement(todoItem, { onUpdateTodo, onDeleteTodo }) {
        const todoItemElement = todoItem.completed
            ? element`<li class="todo-item"><input type="checkbox" class="checkbox" checked>
                                    <span class="todo-text"><s>${todoItem.title}</s></span>
                                    <button class="delete">削除</button>
                                </li>`
            : element`<li class="todo-item"><input type="checkbox" class="checkbox">
                                    <span class="todo-text">${todoItem.title}</span>
                                    <button class="delete">削除</button>
                                </li>`;
        
        const inputCheckboxElement = todoItemElement.querySelector(".checkbox");
        const deleteButtonElement = todoItemElement.querySelector(".delete");

        inputCheckboxElement.addEventListener("change", () => {
            onUpdateTodo({
                id: todoItem.id,
                completed: !todoItem.completed
            });
        });

        deleteButtonElement.addEventListener("click", () => {
            onDeleteTodo({
                id: todoItem.id
            });
        });

        return todoItemElement;
    }
}

