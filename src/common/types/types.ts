import { TaskType, TodoListType } from "../../features/todolists/api/todoApi";

export type TasksType = {
  [key: string]: TaskType[];
};

export type DomainTodolist = TodoListType & {
  filter: FiltersType;
  entityStatus: RequestStatusType;
};

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";

export type FiltersType = "all" | "completed" | "current";

export type ResponseType<D = {}> = {
  resultCode: number;
  messages: string[];
  data: D;
};
