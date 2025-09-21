import { EventNotify } from "../EventNotify";
import { TodolistItems } from "./TodolistItems";

class TodolistModel extends EventNotify {
    #Items;

    /**  
     * @param {TodolistItems[]} items TodolistItemsの配列
     */
    constructor(items=[]) {
        super();
        this.#Items = items;
    }

    /**
     * TodolistItemsの数を取得
     * @returns {number} TodolistItemsの数
     */
    getTotalitem(){
        return this.#Items.length;
    }

    /**
     * 完了したTodolistItemsの配列を取得
     * @returns {TodolistItems[]} 完了したTodolistItemsの配列
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

    /**
     * 
     * @param {TodolistItems} todoItem 
     */
    addTodo(todoItem){
        this.#Items.push(todoItem);
        this.notify("change");
    }
}
