import { element } from "./html_utils.js";
import { TodoItemModel } from "../model/TodoItemModel.js";
export class TodoItemView {
    /**
     * `todoItem`に対応するTodoアイテムのHTML要素を作成して返す
     * @param {TodoItemModel} todoItem TodoItemModel
     * @param {function({id:number, completed: boolean})} onUpdateTodo チェックボックスの更新イベントリスナー
     * @param {function({id:number})} onDeleteTodo 削除ボタンのクリックイベントリスナー
     * @param {function({id:number})} onStartEdit 編集開始イベントリスナー
     * @param {function({id:number, title: string, completed: boolean})} onFinishEdit 編集完了イベントリスナー
     * @param {function({id:number})} onCancelEdit 編集キャンセルイベントリスナー
     * @param {function(number): boolean} isEditing 編集状態を判定する関数
     * @returns {Element}
     */
    createElement(
        todoItem,
        { onUpdateTodo, onDeleteTodo, onStartEdit, onFinishEdit, onCancelEdit, onDraftTitleChange, onDraftTitleDelete,isEditing, getDraftTitle }
    ) {
        const editing = isEditing(todoItem.id);
        const draftTitle = getDraftTitle(todoItem.id);
        const title = draftTitle ?? todoItem.title;
        const todoItemElement = element
            `<li class="todo">
                <div class="todo-item todo-display">
                    <input type="checkbox" class="checkbox" ${todoItem.completed ? "checked" : ""}>
                    <span class="todo-text">${title}</span>
                    <button class="edit">編集</button>
                    <button class="delete">削除</button>
                </div>
                <div class="todo-item todo-edit" style="display: none;">
                    <input type="text" class="todo-edit-input" value="${title}">
                    <button class="save">保存</button>
                    <button class="cancel">キャンセル</button>
                </div>
            </li>`;
        const editElement = todoItemElement.querySelector(".todo-edit");
        const editElementInput = todoItemElement.querySelector(".todo-edit-input");
        const itemElement = todoItemElement.querySelector(".todo-display");
        const inputCheckboxElement = todoItemElement.querySelector(".checkbox");
        const deleteButtonElement = todoItemElement.querySelector(".delete");
        const editButtonElement = todoItemElement.querySelector(".edit");
        const saveButtonElement = todoItemElement.querySelector(".save");
        const cancelButtonElement = todoItemElement.querySelector(".cancel");

        itemElement.style.display = editing ? "none" : "flex";
        editElement.style.display = editing ? "flex" : "none";

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
            onStartEdit?.({ id: todoItem.id });
        });

        saveButtonElement.addEventListener("click", () => {
            const nextTitle = editElement.querySelector(".todo-edit-input").value;
            onDraftTitleDelete?.({ id: todoItem.id });
            onFinishEdit?.({
                id: todoItem.id,
                title: nextTitle,
                completed: todoItem.completed
            });
        });

        editElementInput.addEventListener("input", () => {
            onDraftTitleChange?.({ id: todoItem.id, title: editElementInput.value });
        });

        cancelButtonElement.addEventListener("click", () => {
            onDraftTitleDelete?.({ id: todoItem.id });
            onCancelEdit?.({ id: todoItem.id });
        });

        return todoItemElement;
    }
}
