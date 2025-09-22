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
    createElement(todoItem, { onUpdateTodo, onDeleteTodo}) {
        const todoItemElement = todoItem.completed
            ? element`<li><input type="checkbox" class="checkbox" checked>
                                    <s>${todoItem.title}</s>
                                    <button class="edit">edit</button>
                                    <button class="delete">x</button>
                                </li>`
            : element`<li><input type="checkbox" class="checkbox">
                                    ${todoItem.title}
                                    <button class="edit">edit</button>
                                    <button class="delete">x</button>
                                </li>`;
        const inputCheckboxElement = todoItemElement.querySelector(".checkbox");
        inputCheckboxElement.addEventListener("change", () => {
            // コールバック関数に変更
            onUpdateTodo({
                id: todoItem.id,
                completed: !todoItem.completed
            });
        });
        const deleteButtonElement = todoItemElement.querySelector(".delete");
        deleteButtonElement.addEventListener("click", () => {
            // コールバック関数に変更
            onDeleteTodo({
                id: todoItem.id
            });
        });
        // const editButtonElement = todoItemElement.querySelector(".edit");
        // editButtonElement.addEventListener('click', () => {
        //     onEditTodo(
        //         {
        //             id: todoItem.id,
        //             title: todoItem.title
        //         }
        //     )
        // })

        // 作成したTodoアイテムのHTML要素を返す
        return todoItemElement;
    }
}
