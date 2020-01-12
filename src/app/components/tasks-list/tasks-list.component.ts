import { Component, OnInit, ɵConsole } from "@angular/core";
import { TasksService } from "../../services/tasks.service";
import { Task } from "../../dto/task";
import { ListsService } from "../../services/lists.service";
import { List } from "../../dto/list";
import { ActivatedRoute } from "@angular/router";
import { promise } from 'protractor';

@Component({
  selector: "app-tasks-list",
  templateUrl: "./tasks-list.component.html",
  styleUrls: ["./tasks-list.component.scss"]
})
export class TasksListComponent implements OnInit {
  constructor(
    public tasksService: TasksService,
    public listsService: ListsService,
    private route: ActivatedRoute
  ) {}

  currentListTasks: Task[] = new Array();
  currentPageUrl: string;
  pageUrl: string;
  allTasks: Task[];
  allLists: List[];
  listUrlTitle: List;

  getListUrlTitle(listId: string) {
    this.listsService.getLists().subscribe(response => {
      this.allLists = response.json();
      for (let index = 0; index < this.allLists.length; index++) {
        if (this.allLists[index]._id === listId)
          this.listUrlTitle = this.allLists[index];
      }
      this.getListData();
    });
  }

  getListData() {
    this.tasksService.getTasks().subscribe(response => {
      this.allTasks = response.json();
      for (let index = 0; index < this.allTasks.length; index++) {
        if ((this.allTasks[index].list == this.listUrlTitle._id))
          this.currentListTasks.push(this.allTasks[index]);
        }
      // this.getListData();
    });
  }

  doneTask(task){
    this.tasksService.compeleteTask(task)
    this.currentListTasks.splice(task, 1)
  }


  // move a task to main list
  movingTask(movedTask){
    for (let index = 0; index < this.allLists.length; index++) {
      if(this.allLists[index].isMain == true)
        var mainListId = this.allLists[index]._id      
    }
    this.tasksService.moveTask(movedTask, mainListId)
    this.currentListTasks.splice(movedTask, 1)

  }

  // delete a task from this list
  deleteTask(task) {
    this.tasksService.deleteTask(task).subscribe(response => {
      let deletedObject = response.json();
      let deletedObjectIndex = this.currentListTasks.indexOf(deletedObject);
      this.currentListTasks.splice(deletedObjectIndex, 1);
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.getListUrlTitle((params as any).listId);
    });
  }
}