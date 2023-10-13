"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
////////////////////////////////////////////// Dragon /////////////////////////////////////////////
// HTML Elements
let speechBox = document.querySelector("#dragon-text");
// This uses recursion to spell out what the dragon is saying, one letter at a time. setTimeout calls
// dragonSays until it reaches the end of the message.
function dragonSays(text, index) {
    if (index == 0) {
        speechBox.innerHTML = "";
    }
    speechBox.innerHTML += text.charAt(index);
    index++;
    if (index < text.length) {
        setTimeout(() => dragonSays(text, index), 100);
    }
}
// This function makes the dragon respond when the user checks off a task
function dragonEats(size) {
    return __awaiter(this, void 0, void 0, function* () {
        if (size) {
            let sound = new Audio("sounds/big-snack.mp3");
            let text = "That is so delicious! Thank you!";
            yield sound.play();
            dragonSays(text, 0);
        }
        else {
            let sound = new Audio("sounds/small-snack.mp3");
            let text = "Tasty!";
            yield sound.play();
            dragonSays(text, 0);
        }
    });
}
/////////////////////////////////////////// Task List/////////////////////////////////////////////
let taskString = window.localStorage.getItem("tasks") || "empty";
let list = document.querySelector("#task-list");
let tasks = [];
let taskMap = new Map();
let count = 0;
// This goes through the items in local storage and makes class objects that get added to the tasks list. It also makes HTML elements
// to correspond with those objects using the make ChecklistItem.
function displayTasks() {
    if (taskString != "empty") {
        try {
            tasks = JSON.parse(taskString);
            for (let objTask of tasks) {
                if (objTask.subTasks == null) {
                    let task = new Task(objTask.text, objTask.description, objTask.dateEntered, objTask.dateDue, objTask.subTasks);
                    let checkPackage = makeChecklistItem(task, count, task.parentId);
                    if (list) {
                        list.appendChild(checkPackage);
                    }
                    else {
                        console.log("Could not find task-list");
                    }
                }
                else {
                    let newSubTasks = [];
                    for (let subTask of objTask.subTasks) {
                        let newSubTask = new SubTask(subTask.text, subTask.completed);
                        newSubTasks.push(newSubTask);
                    }
                    let task = new Task(objTask.text, objTask.description, objTask.dateEntered, objTask.dateDue, newSubTasks);
                    let dropDown = document.createElement("button");
                    dropDown.classList.add("dropDown");
                    let parentId = `task-${count}`;
                    dropDown.id = parentId;
                    dropDown.textContent = `▼${task.text}`;
                    taskMap.set(parentId, task);
                    let dropLabel = document.createElement("label");
                    dropLabel.appendChild(dropDown);
                    let subTaskList = document.createElement("div");
                    subTaskList.id = `subs-${count}`;
                    subTaskList.classList.add("sub-div");
                    subTaskList.classList.add("hidden");
                    if (task.subTasks != null) {
                        for (let subTask of task.subTasks) {
                            let checkPackage = makeChecklistItem(subTask, count, parentId);
                            subTaskList.appendChild(checkPackage);
                            count++;
                        }
                    }
                    list === null || list === void 0 ? void 0 : list.appendChild(dropLabel);
                    list === null || list === void 0 ? void 0 : list.appendChild(subTaskList);
                }
                count++;
            }
        }
        catch (error) {
            console.log("Could not read local storage");
        }
    }
}
// Makes Html elements for the class object tasks.
function makeChecklistItem(task, count, parentId) {
    task.parentId = parentId;
    let check = document.createElement("input");
    check.type = "checkbox";
    check.id = `Task${count}`;
    let label = document.createElement("label");
    label.htmlFor = `Task${count}`;
    if (task.completed) {
        check.checked = true;
        label.classList.add('checked');
    }
    label.appendChild(check);
    label.appendChild(document.createTextNode(task.text));
    taskMap.set(check.id, task);
    return label;
}
//////////////////////////////////// Buttons and checkboxes///////////////////////////////////////
const newTaskBtn = document.querySelector("#new-task");
const planner = document.querySelector("#planner");
const taskInputForm = document.getElementById("task-form");
const saveBtn = document.querySelector("#save");
const subTaskBtn = document.querySelector("#add-subTask");
let subInputs = 0;
// CheckBoxes
list === null || list === void 0 ? void 0 : list.addEventListener("change", function (event) {
    var _a, _b;
    console.log("check");
    let taskElement = event.target;
    // If the task list element is found, an event listener is added for all check inputs inside of it
    if (taskElement instanceof HTMLInputElement && taskElement.type == "checkbox") {
        let task = taskMap.get(taskElement.id);
        if (task) {
            // Task Checked
            if (taskElement.checked) {
                task.completed = true;
                const label = document.querySelector(`label[for="${taskElement.id}"]`);
                if (label) {
                    label.classList.add('checked');
                    // size false = small, true = big
                    let size = false;
                    if (task instanceof SubTask) {
                        console.log(task.parentId);
                        let parentTask = taskMap.get(task.parentId);
                        if (parentTask === null || parentTask === void 0 ? void 0 : parentTask.checkCompleted()) {
                            console.log(2);
                            let parentTaskElement = document.querySelector(`#${task.parentId}`);
                            parentTaskElement === null || parentTaskElement === void 0 ? void 0 : parentTaskElement.classList.add("checked");
                            (_a = parentTaskElement === null || parentTaskElement === void 0 ? void 0 : parentTaskElement.parentElement) === null || _a === void 0 ? void 0 : _a.classList.add("checked");
                            size = true;
                        }
                    }
                    dragonEats(size);
                }
                else {
                    console.log("Could not find label for clicked element");
                }
            }
            // Task Unchecked
            else {
                task.completed = false;
                const label = document.querySelector(`label[for="${taskElement.id}"]`);
                if (task instanceof SubTask) {
                    console.log(task.parentId);
                    let parentTask = taskMap.get(task.parentId);
                    if (!(parentTask === null || parentTask === void 0 ? void 0 : parentTask.checkCompleted())) {
                        console.log(2);
                        let parentTaskElement = document.querySelector(`#${task.parentId}`);
                        parentTaskElement === null || parentTaskElement === void 0 ? void 0 : parentTaskElement.classList.remove("checked");
                        (_b = parentTaskElement === null || parentTaskElement === void 0 ? void 0 : parentTaskElement.parentElement) === null || _b === void 0 ? void 0 : _b.classList.remove("checked");
                    }
                }
                if (label) {
                    label.classList.remove('checked');
                }
                else {
                    console.log("Could not find label for clicked element");
                }
            }
            let jsonString = JSON.stringify(tasks);
            localStorage.setItem("tasks", jsonString);
        }
        else {
            console.log("Could not find task on taskMap");
        }
    }
    else {
        console.log("Despite being found by the event listener, the computer could not find the checkbox that triggered this function... Because it is stupid.");
    }
});
// DropDown menu for subtasks
list === null || list === void 0 ? void 0 : list.addEventListener("click", function (event) {
    const dropDownBtn = event.target;
    if (dropDownBtn.classList.contains('dropDown')) {
        let idParts = dropDownBtn.id.split("-");
        let subList = document.querySelector(`#subs-${idParts[1]}`);
        if (subList === null || subList === void 0 ? void 0 : subList.classList.contains("hidden")) {
            subList.classList.remove("hidden");
        }
        else {
            subList === null || subList === void 0 ? void 0 : subList.classList.add("hidden");
        }
    }
});
// New Task Button
if (newTaskBtn && taskInputForm) {
    newTaskBtn.addEventListener("click", () => {
        planner.style.display = "none";
        taskInputForm.style.display = "block";
        subInputs = 0;
    });
}
// Save Button
if (saveBtn && taskInputForm) {
    saveBtn.addEventListener("click", () => {
        const textInput = document.querySelector("#text");
        const descriptionInput = document.querySelector("#description");
        const dateInput = document.querySelector("#date");
        const dueInput = document.querySelector("#due");
        if (textInput && descriptionInput && dateInput && dueInput) {
            const text = textInput.value;
            const description = descriptionInput.value;
            const date = dateInput.value;
            const due = dueInput.value;
            let subTasks = [];
            let subTaskElements = document.querySelectorAll(".subTask");
            let task;
            if (subTaskElements.length > 0) {
                for (let element of subTaskElements) {
                    if (element instanceof HTMLInputElement) {
                        let subTask = new SubTask(element.value, false);
                        subTasks.push(subTask);
                    }
                    else {
                        console.log("Could not read subtasks as input elements");
                    }
                }
                task = new Task(text, description, date, due, subTasks);
                tasks.push(task);
            }
            else {
                task = new Task(text, description, date, due, null);
                tasks.push(task);
            }
            let taskElement = makeChecklistItem(task, count, `task-${count}`);
            list === null || list === void 0 ? void 0 : list.appendChild(taskElement);
            taskString = JSON.stringify(tasks);
            localStorage.setItem("tasks", taskString);
        }
        else {
            console.log(textInput);
            console.log(descriptionInput);
            console.log(dateInput);
            console.log(textInput);
        }
        planner.style.display = "grid";
        taskInputForm.style.display = "none";
    });
}
// Add Sub Task Button
if (subTaskBtn) {
    subTaskBtn.addEventListener("click", () => {
        event === null || event === void 0 ? void 0 : event.preventDefault();
        subInputs++;
        let textBox = document.createElement("input");
        textBox.placeholder = "Enter a sub task here";
        textBox.type = "text";
        textBox.classList.add('subTask');
        let label = document.createElement("label");
        label.appendChild(document.createTextNode(`Sub Task ${subInputs}`));
        label.appendChild(textBox);
        let formInputs = document.querySelector("#form-inputs");
        formInputs === null || formInputs === void 0 ? void 0 : formInputs.appendChild(label);
    });
}
///////////////////////////////////////////////// Calls/////////////////////////////////////////////
dragonSays("Hello World! Tasks are my favorite snack!", 0);
displayTasks();
