import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { TasksType } from "../../../common/types/types";
import { todolistsThunks } from "./todoListsReducer";
import { setAppError, setAppStatus } from "../../../app/model/appReducer";
import {
  TaskStatus,
  TaskPriority,
  ResponseStatus,
} from "../../../common/enums/enums";
import { createAppAsyncThunk } from "../../../common/hooks/hooks";
import { TaskType, todoApi, TaskRequestType } from "../api/todoApi";

const initialState: TasksType = {};

export const slice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  selectors: {
    tasksSelector: (state) => state,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      const { tasks, todolistId } = action.payload;
      state[todolistId] = tasks;
    });
    builder.addCase(todolistsThunks.addTodolist.fulfilled, (state, action) => {
      const todolistId = action.payload.todolist.id;
      state[todolistId] = [];
    });
    builder.addCase(
      todolistsThunks.removeTodolist.fulfilled,
      (state, action) => {
        const todolistId = action.payload.todolistId;

        delete state[todolistId];
      }
    );
    builder.addCase(
      todolistsThunks.fetchTodolists.fulfilled,
      (state, action) => {
        const todolists = action.payload.todolists;

        todolists.forEach((todo) => (state[todo.id] = []));
      }
    );
    builder.addCase(addTask.fulfilled, (state, action) => {
      const { todolistId, task } = action.payload;
      state[todolistId].unshift(task);
    });
    builder.addCase(removeTask.fulfilled, (state, action) => {
      const { todolistId, taskId } = action.payload;
      const task = state[todolistId].find((task) => task.id === taskId);
      if (task) {
        state[todolistId].splice(state[todolistId].indexOf(task), 1);
      }
    });
    builder.addCase(updateTask.fulfilled, (state, action) => {
      const { todolistId, taskId, taskRequestModel } = action.payload;
      const tasks = state[todolistId];
      const index = tasks.findIndex((task) => task.id === taskId);
      if (index !== -1) {
        tasks[index] = { ...tasks[index], ...taskRequestModel };
      }
    });
  },
});

const fetchTasks = createAsyncThunk<
  { todolistId: string; tasks: TaskType[] },
  string
>(`${slice.name}/fetchTasks`, async (todolistId, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    dispatch(setAppStatus({ status: "loading" }));
    const response = await todoApi.getTasks(todolistId);
    if (response.status === ResponseStatus.Success) {
      const tasks = response.data.items;
      dispatch(setAppStatus({ status: "succeeded" }));
      return { todolistId, tasks };
    } else {
      return rejectWithValue(null);
    }
  } catch (e) {
    return rejectWithValue(null);
  }
});

const addTask = createAsyncThunk<
  { todolistId: string; task: TaskType },
  { todolistId: string; title: string }
>(`${slice.name}/addTask`, async ({ todolistId, title }, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    dispatch(setAppStatus({ status: "loading" }));
    const response = await todoApi.addTask(todolistId, title);
    if (response.data.resultCode === ResponseStatus.Success) {
      dispatch(setAppStatus({ status: "succeeded" }));
      return { todolistId, task: response.data.data.item };
    } else {
      dispatch(setAppError({ error: response.data.messages[0] }));
      return rejectWithValue(null);
    }
  } catch (error) {
    return rejectWithValue(null);
  }
});

const removeTask = createAsyncThunk<
  { todolistId: string; taskId: string },
  { todolistId: string; taskId: string }
>(`${slice.name}/removeTask`, async ({ todolistId, taskId }, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    dispatch(setAppStatus({ status: "loading" }));
    const response = await todoApi.removeTask(todolistId, taskId);
    if (response.data.resultCode === ResponseStatus.Success) {
      dispatch(setAppStatus({ status: "succeeded" }));
      return { todolistId, taskId };
    } else {
      dispatch(setAppError({ error: response.data.messages[0] }));
      return rejectWithValue(null);
    }
  } catch (error) {
    return rejectWithValue(null);
  }
});
const updateTask = createAppAsyncThunk<
  {
    taskRequestModel: RequestDomainTaskModelType;
    todolistId: string;
    taskId: string;
  },
  {
    taskRequestModel: RequestDomainTaskModelType;
    todolistId: string;
    taskId: string;
  }
>(
  `${slice.name}changeTaskStatus`,
  async ({ taskRequestModel, todolistId, taskId }, thunkAPI) => {
    const { dispatch, rejectWithValue, getState } = thunkAPI;
    dispatch(setAppStatus({ status: "loading" }));
    const state = getState();
    const task = state.tasks[todolistId].find((task) => task.id === taskId);
    if (!task) {
      return rejectWithValue(null);
    }
    const apiModel: TaskRequestType = {
      title: task.title,
      description: task.description,
      completed: task.completed,
      status: task.status,
      priority: task.priority,
      startDate: task.startDate,
      deadline: task.deadline,
      ...taskRequestModel,
    };
    const response = await todoApi.changeTaskStatus(
      apiModel,
      todolistId,
      taskId
    );
    if (response.status === 200) {
      dispatch(setAppStatus({ status: "succeeded" }));
      return { taskRequestModel: apiModel, todolistId, taskId };
    } else {
      return rejectWithValue(null);
    }
  }
);

export const tasksSelector = slice.selectors.tasksSelector;
export const tasksReducer = slice.reducer;
export const tasksThunks = {
  fetchTasks,
  addTask,
  removeTask,
  updateTask,
};

export type RequestDomainTaskModelType = {
  title?: string;
  description?: string;
  completed?: boolean;
  status?: TaskStatus;
  priority?: TaskPriority;
  startDate?: string;
  deadline?: string;
};
