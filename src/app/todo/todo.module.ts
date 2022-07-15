import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatMenuModule} from '@angular/material/menu';
import { TodoRoutingModule } from './todo-routing.module';
import { TodoComponent } from './todo.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatDialogModule} from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TodoDialogComponent } from '../components/todo-dialog/todo-dialog.component';
import {MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { AddUserDialogComponent } from '../components/add-user-dialog/add-user-dialog.component';
import { UserService } from '../services/user.service';
import { TodoService } from '../services/todo.service';
import { HttpClientModule } from '@angular/common/http';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { AddTodoDialogComponent } from '../components/add-todo-dialog/add-todo-dialog.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { TaskService } from '../services/task.service';




@NgModule({
  declarations: [
    TodoComponent,
    TodoDialogComponent,
    AddUserDialogComponent,
    AddTodoDialogComponent,
  ],
  imports: [
    CommonModule,
    TodoRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    DragDropModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatMenuModule,
    HttpClientModule,
    MatSnackBarModule,
    MatTooltipModule,
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, 
      useValue: {appearance: 'fill'}
    },
    UserService,
    TodoService,
    TaskService,
  ]
})
export class TodoModule { }
