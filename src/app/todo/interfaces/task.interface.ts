export interface TaskModel{
    id: string,
    name: string,
    isCompleted: boolean
}

export interface TaskDto{
    todoId: string;
    taskTitle: string;
}

export interface UpdateStatusTaskDTO{
    taskId: string;
    isCompleted: boolean;
}