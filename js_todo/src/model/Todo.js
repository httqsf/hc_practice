import { EventNotify } from "../EventNotify.js";
import { TodoItemModel } from "./TodoItemModel.js";

export class TodolistModel extends EventNotify {
    #Items;

    /**  
     * @param {TodoItemModel[]} items TodoItemModelの配列
     */
    constructor(items=[]) {
        super();
        this.#Items = items;
    }

    getItems(){
        return this.#Items
    }

    /**
     * TodoItemModelの数を取得
     * @returns {number} TodoItemModelの数
     */
    getTotalitem(){
        return this.#Items.length;
    }

    /**
     * 完了したTodoItemModelの配列を取得
     * @returns {number} 完了したTodoItemModelの数
     */
    getCompletedItem(){
        return this.#Items.filter(item => item.completed).length;
    }

    /**
     * 完了していないTodolistItemsの配列を取得
     * @returns {number} 完了していないTodolistItemsの数
     */
    getUncompletedItem(){
        return this.#Items.filter(item => !item.completed).length;
    }


    /**
     * Todolistが変更されたときに呼ばれるハンドラー
     * @param {Function} listener 
     */
    onChange(listener){
        this.addEventListener("change", listener);
    }

    /**
     * TodoItemModelを追加
     * @param {TodoItemModel} todoItem TodoItemModel
     */
    addTodo(todoItem){
        this.#Items.push(todoItem);
        this.notify("change");
    }

    /**
     * TodoItemModelを更新
     * @param {{id: number, title: string, completed: boolean}} 
     */
    updateTodo({id, title, completed}){
        const targetItem = this.#Items.find(item => item.id === id);
        if (targetItem){
            targetItem.title = title;
            targetItem.completed = completed;
            this.notify("change");
        }
    }

    /**
     * TodoItemModelを削除
     * @param {{id: number}} 
     */
    deleteTodo({id}){
        this.#Items = this.#Items.filter(item => item.id !== id)
        this.notify("change");
    }
}
