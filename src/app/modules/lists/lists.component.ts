import { Component, OnInit } from '@angular/core';
import { AppService } from '../../services/app.service';
import { List } from '../../models/list.model';
import { NotificationService } from '../../services/notification.service';
import { NameDialogComponent } from '../../components/name-dialog/name-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
    selector: 'app-lists',
    templateUrl: './lists.component.html',
    styleUrls: ['./lists.component.scss'],
})
export class ListsComponent implements OnInit {
    public lists: Array<List> = [];

    constructor(
        private readonly appService: AppService,
        private readonly notificationService: NotificationService,
        private matDialog: MatDialog,
        private readonly router: Router
    ) {}

    ngOnInit(): void {
        this.getLists();
    }

    private getLists(): void {
        this.appService.getLists().subscribe((response) => (this.lists = response));
    }

    public removeList(listId: string): void {
        this.appService.removeListById(listId).subscribe(
            () => this.getLists(),
            () => this.notificationService.onError('Something went wrong!'),
            () => this.notificationService.onError('The List Removed!')
        );
    }

    public openListDialog(list?: List): void {
        this.matDialog
            .open(NameDialogComponent, { data: { info: list ? list : null, type: 'list' } })
            .afterClosed()
            .subscribe((result: boolean) => result && this.getLists());
    }

    public addNewList(): void {
        this.notificationService.onError('The API has not been initialized!');
    }

    public navigateToSpecificListTasks(list: List): void {
        this.router.navigate(['/list-item', list._id]).finally();
    }
}
