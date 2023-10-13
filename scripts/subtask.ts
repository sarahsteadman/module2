class SubTask {
    text : string;
    completed : boolean;
    parentId : string = "";

    constructor( text: string, completed: boolean){
        this.text = text;
        this.completed = completed;
    }
    checkCompleted(): boolean{
        console.log("Why are you checking to seeing if a subTask is complete?");

        return this.completed;
    }
}