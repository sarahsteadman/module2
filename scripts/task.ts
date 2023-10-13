class Task{
    text: string;
    description: string;
    dateEntered: String;
    dateDue: String;
    completed: boolean;
    subTasks: SubTask[] | null;
    parentId: string = "";

    
    constructor(text: string, description: string, dateEntered: String, dateDue: String, subTasks: SubTask[] | null){
        this.text = text;
        this.description = description;
        this.dateEntered = dateEntered;
        this.dateDue = dateDue;
        this.completed = false;
        this.subTasks = subTasks;
    }

    checkCompleted(): boolean{
        this.completed = true;
        if (this.subTasks != null){
            for( let subTask of this.subTasks){
                if (!subTask.completed){
                    console.log(subTask.completed);
                    this.completed = false;
                }
            }
        }
        return this.completed;
    }
}