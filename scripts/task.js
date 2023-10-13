"use strict";
class Task {
    constructor(text, description, dateEntered, dateDue, subTasks) {
        this.parentId = "";
        this.text = text;
        this.description = description;
        this.dateEntered = dateEntered;
        this.dateDue = dateDue;
        this.completed = false;
        this.subTasks = subTasks;
    }
    checkCompleted() {
        this.completed = true;
        if (this.subTasks != null) {
            for (let subTask of this.subTasks) {
                if (!subTask.completed) {
                    console.log(subTask.completed);
                    this.completed = false;
                }
            }
        }
        return this.completed;
    }
}
