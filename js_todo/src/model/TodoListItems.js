let todoIdx = 0;

class TodolistItems {
    
    /** @type {number} TodolistItemsのID**/
    id;
    /** @type {string} TodolistItemsのタイトル**/
    title;
    /** @type {boolean} TodolistItemsの完了状態**/
    completed;

    constructor(title, completed) {
        this.id = todoIdx++;
        this.title = title;
        this.completed = completed;
    }

}
