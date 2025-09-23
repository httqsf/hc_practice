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
        const todoItemElement = element
            `<li class="todo-item">
                <input type="checkbox" class="checkbox" ${todoItem.completed ? "checked" : ""}>
                <span class="todo-text">${todoItem.title}</span>
                <button class="edit">編集</button>
                <button class="delete">削除</button>
            </li>
            <li class="todo-edit" style="display: none;">
                <input type="text" class="todo-edit-input" value="${todoItem.title}">
                <button class="save">保存</button>
                <button class="cancel">キャンセル</button>
            </li>`;
        const inputCheckboxElement = todoItemElement.querySelector(".checkbox");
        const deleteButtonElement = todoItemElement.querySelector(".delete");
        const editButtonElement = todoItemElement.querySelector(".edit");
        const saveButtonElement = todoItemElement.querySelector(".save");
        const cancelButtonElement = todoItemElement.querySelector(".cancel");
        const editElement = todoItemElement.querySelector(".todo-edit");
        const itemElement = todoItemElement.querySelector(".todo-item");

        inputCheckboxElement.addEventListener("change", () => {
            onUpdateTodo({
                id: todoItem.id,
                title: todoItem.title,
                completed: !todoItem.completed
            });
        });

        deleteButtonElement.addEventListener("click", () => {
            onDeleteTodo({
                id: todoItem.id
            });
        });

        editButtonElement.addEventListener("click", () => {
            itemElement.style.display = "none";
            editElement.style.display = "block";
        });

        saveButtonElement.addEventListener("click", () => {
            onUpdateTodo({
                id: todoItem.id,
                title: editElement.querySelector(".todo-edit-input").value,
                completed: todoItem.completed
            });
        })

        cancelButtonElement.addEventListener("click", () => {
            itemElement.style.display = "block";
            editElement.style.display = "none";
            editElement.value = todoItem.title;
        })

        return todoItemElement;
    }
}
