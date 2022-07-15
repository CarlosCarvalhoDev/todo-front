import { TaskModel } from "./task.interface";

export interface TodoUser {
  userId: string;
  userName: string;
  todoList: TodoSumary[];
}

export interface TodoSumary {
  id: string;
  title: string;
}

export interface Todo {
  id: string;
  title: string;
  description: string;
  tasks: TaskModel[];
}

export interface TodoDto{
  userId: string;
  title: string;
  description: string;
}

export interface UpdateTodoDTO{
  title: string;
  description: string;
}

export interface TodoChangeUserDto{
  userId: string;
}

