import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "../features/auth/model/authSlice";
import { tasksReducer } from "../features/todolists/model/tasksReducer";
import { todoListsReducer } from "../features/todolists/model/todoListsReducer";
import { appReducer } from "./model/appReducer";

export const store = configureStore({
  reducer: {
    todoLists: todoListsReducer,
    tasks: tasksReducer,
    app: appReducer,
    auth: authSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
