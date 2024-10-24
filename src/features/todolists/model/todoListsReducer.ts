import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { setAppError, setAppStatus } from "../../../app/model/appReducer";
import { DomainTodolist, FiltersType } from "../../../common/types/types";
import { todoApi, TodoListType, TodoListRequestType } from "../api/todoApi";
import { ResponseStatus } from "../../../common/enums/enums";

const initialState: DomainTodolist[] = [];

export const slice = createSlice({
  name: "todoLists",
  initialState,
  reducers: {
    changeTodoListFilterAC: (
      state,
      action: PayloadAction<{ todolistId: string; filter: FiltersType }>
    ) => {
      const todo = state.find((todo) => todo.id === action.payload.todolistId);
      if (todo) {
        todo.filter = action.payload.filter;
      }
    },
  },
  selectors: {
    todolistsSelector: (state) => state,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTodolists.fulfilled, (_, action) => {
      const fetchedTodolists = action.payload.todolists;
      return fetchedTodolists.map((todo) => {
        return { ...todo, filter: "all", entityStatus: "idle" };
      });
    });
    builder.addCase(addTodolist.fulfilled, (state, action) => {
      const newTodo: DomainTodolist = {
        ...action.payload.todolist,
        filter: "all",
        entityStatus: "idle",
      };
      state.unshift(newTodo);
    });
    builder.addCase(removeTodolist.fulfilled, (state, action) => {
      const todolistId = action.payload.todolistId;
      const todo = state.find((todo) => todo.id === todolistId);
      if (todo) {
        state.splice(state.indexOf(todo), 1);
      }
    });
    builder.addCase(changeTodoListTitle.fulfilled, (state, action) => {
      const { newTitle, todolistId } = action.payload;
      const todo = state.find((todo) => todo.id === todolistId);
      if (todo) {
        todo.title = newTitle;
      }
    });
  },
});

const fetchTodolists = createAsyncThunk<{ todolists: TodoListType[] }>(
  `${slice.name}/fetchTodolists`,
  async (_, thunkApi) => {
    const { dispatch, rejectWithValue } = thunkApi;
    try {
      dispatch(setAppStatus({ status: "loading" }));
      const response = await todoApi.getTodolists();
      dispatch(setAppStatus({ status: "succeeded" }));
      return { todolists: response.data };
    } catch (e) {
      return rejectWithValue(null);
    }
  }
);
const addTodolist = createAsyncThunk<{ todolist: TodoListType }, string>(
  `${slice.name}/addTodolist`,
  async (title: string, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(setAppStatus({ status: "loading" }));
      const response = await todoApi.createTodolist(title);
      if (response.data.resultCode === ResponseStatus.Success) {
        dispatch(setAppStatus({ status: "succeeded" }));
        return { todolist: response.data.data.item };
      } else {
        console.log(response.data.messages[0]);
        dispatch(setAppStatus({ status: "failed" }));
        dispatch(setAppError({ error: response.data.messages[0] }));
        return rejectWithValue(null);
      }
    } catch (e) {
      return rejectWithValue(null);
    }
  }
);
const removeTodolist = createAsyncThunk<{ todolistId: string }, string>(
  `${slice.name}/removeTodolist`,
  async (todolistId, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(setAppStatus({ status: "loading" }));
      await todoApi.deleteTodolists(todolistId);
      dispatch(setAppStatus({ status: "succeeded" }));
      return { todolistId };
    } catch (e) {
      return rejectWithValue(null);
    }
  }
);
const changeTodoListTitle = createAsyncThunk<
  TodoListRequestType,
  TodoListRequestType
>(`${slice.name}/changeTodoTitle`, async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    dispatch(setAppStatus({ status: "loading" }));
    await todoApi.updateTodolists(arg.todolistId, arg.newTitle);
    dispatch(setAppStatus({ status: "succeeded" }));
    return arg;
  } catch (e) {
    return rejectWithValue(null);
  }
});

export const todoListsReducer = slice.reducer;
export const todolistsThunks = {
  addTodolist,
  fetchTodolists,
  removeTodolist,
  changeTodoListTitle,
};
export const todolistsSelector = slice.selectors.todolistsSelector;
export const { changeTodoListFilterAC } = slice.actions;
// export const todolistsSelector = (state: RootState) => state.todoLists;
