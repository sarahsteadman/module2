"use strict";
class SubTask {
    constructor(text, completed) {
        this.parentId = "";
        this.text = text;
        this.completed = completed;
    }
    checkCompleted() {
        console.log("Why are you checking to seeing if a subTask is complete?");
        return this.completed;
    }
}
