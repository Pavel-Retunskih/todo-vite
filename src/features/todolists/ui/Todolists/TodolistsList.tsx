import { memo, useCallback, useEffect } from "react";

import { TodoList } from "./Todolist/TodoList";
import { Input } from "../../../../common/components/AddItemForm/Input";
import { useAppDispatch, useAppSelector } from "../../../../common/hooks/hooks";
import {
  todolistsSelector,
  todolistsThunks,
} from "../../model/todoListsReducer";
import { Navigate } from "react-router-dom";
import { authThunk } from "../../../auth/model/authSlice";
import { SnackBar } from "../../../../common/components/SnackBar/SnackBar";

export const TodoListsList = memo(function TodoListsList() {
  const dispatch = useAppDispatch();
  const rtkTodos = useAppSelector(todolistsSelector);
  const errors = useAppSelector((state) => state.app.error);
  const status = useAppSelector((state) => state.app.status);
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) return;
    dispatch(todolistsThunks.fetchTodolists());
  }, []);

  //-----------Todos-----------------
  const addTodolist = useCallback(
    (title: string) => {
      dispatch(todolistsThunks.addTodolist(title));
    },
    [dispatch]
  );
  const logOutHandler = () => {
    dispatch(authThunk.logOut());
  };
  if (!isLoggedIn) {
    console.log("redirect to login");
    return <Navigate to='/login' />;
  }
  return (
    <div className='w-full max-w-screen-lg'>
      <SnackBar
        message={errors}
        type={
          status === "failed"
            ? "failed"
            : status === "succeeded"
            ? "succeed"
            : "info"
        }
      />
      <button onClick={logOutHandler}>LogOut</button>
      <Input addItem={addTodolist} />
      <div className='flex flex-wrap gap-4 items-start '>
        {rtkTodos.length === 0 ? (
          <span>No Todo</span>
        ) : (
          rtkTodos.map((todolist) => (
            <TodoList todolist={todolist} key={todolist.id} />
          ))
        )}
      </div>
    </div>
  );
});
