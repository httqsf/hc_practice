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
     * @returns {TodoItemModel[]} 完了したTodoItemModelの配列
     */
    getCompletedItem(){
        return this.#Items.filter(item => item.completed);
    }

    /**
     * 完了していないTodolistItemsの配列を取得
     * @returns {TodolistItems[]} 完了していないTodolistItemsの配列
     */
    getUncompletedItem(){
        return this.#Items.filter(item => !item.completed);
    }

    onChange(listener){
        this.addEventListener("change", listener);
    }

    /**
     * 
     * @param {TodoItemModel} todoItem TodoItemModel
     */
    addTodo(todoItem){
        this.#Items.push(todoItem);
        this.notify("change");
    }

    updateTodo({id, completed}){
        const targetItem = this.#Items.find(item => item.id === id);
        if (targetItem){
            targetItem.completed = completed;
            this.notify("change");
        }
    }

    deleteTodo({id}){
        this.#Items = this.#Items.filter(item => item.id !== id)
        this.notify("change");
    }
}
