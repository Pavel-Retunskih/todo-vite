import { TaskStatus, TaskPriority } from "../../../common/enums/enums";
import { ResponseType } from "../../../common/types/types";
import { instance } from "../../../common/utils/instanse/instanse";
import { RequestDomainTaskModelType } from "../model/tasksReducer";

export const todoApi = {
  getTodolists() {
    return instance.get<TodoListType[]>("/todo-lists/");
  },
  createTodolist(title: string) {
    return instance.post<ResponseType<{ item: TodoListType }>>("/todo-lists/", {
      title,
    });
  },
  updateTodolists(todolistId: string, newTitle: string) {
    return instance.put<{}>(`/todo-lists/${todolistId}`, { title: newTitle });
  },
  deleteTodolists(todolistId: string) {
    return instance.delete<ResponseType>(`/todo-lists/${todolistId}`);
  },

  getTasks(todolistId: string) {
    return instance.get<{ items: TaskType[] }>(
      `/todo-lists/${todolistId}/tasks`
    );
  },
  addTask(todolistId: string, title: string) {
    return instance.post<ResponseType<{ item: TaskType }>>(
      `/todo-lists/${todolistId}/tasks`,
      { title }
    );
  },
  removeTask(todolistId: string, taskId: string) {
    return instance.delete<ResponseType<{}>>(
      `/todo-lists/${todolistId}/tasks/${taskId}`
    );
  },
  changeTaskStatus(
    taskRequestModel: RequestDomainTaskModelType,
    todolistId: string,
    taskId: string
  ) {
    return instance.put<ResponseType<{ item: TaskType }>>(
      `/todo-lists/${todolistId}/tasks/${taskId}`,
      taskRequestModel
    );
  },
  changeTaskTitle(todolistId: string, taskId: string, title: string) {
    return instance.put<ResponseType<{ item: TaskType }>>(
      `/todo-lists/${todolistId}/tasks/${taskId}`,
      { title }
    );
  },
};

export type TodoListType = {
  id: string;
  title: string;
  addedDate: string;
  order: number;
};

export type TaskType = {
  description: string;
  title: string;
  completed: boolean;
  status: TaskStatus;
  priority: TaskPriority;
  startDate: string;
  deadline: string;
  id: string;
  todoListId: string;
  order: number;
  addedDate: string;
};

export type TaskRequestType = {
  title: string;
  description: string;
  completed: boolean;
  status: number;
  priority: number;
  startDate: string;
  deadline: string;
};

export type TodoListRequestType = {
  todolistId: string;
  newTitle: string;
};
