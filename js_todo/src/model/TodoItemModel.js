let todoIdx = 0;

export class TodoItemModel {
    /** @type {number} TodoItemModelのID**/
    id;
    /** @type {string} TodoItemModelのタイトル**/
    title;
    /** @type {boolean} TodoItemModelの完了状態**/
    completed;

    constructor(title, completed) {
        this.id = todoIdx++;
        this.title = title;
        this.completed = completed;
    }

}
