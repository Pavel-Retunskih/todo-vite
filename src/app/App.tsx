import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../common/hooks/hooks";
import { LogIn } from "../features/auth/ui/LogIn/LogIn";
import { TodoListsList } from "../features/todolists/ui/Todolists/TodolistsList";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { appThunk } from "./model/appReducer";

function App() {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((store) => store.app.status);
  const isInitialized = useAppSelector((store) => store.app.isInitialized);

  useEffect(() => {
    console.log("Me request");
    dispatch(appThunk.initializedApp());
  }, []);

  if (!isInitialized) {
    return <span>Loading App...</span>;
  }
  return (
    <BrowserRouter>
      {loading === "loading" && <span>Loading todo...</span>}
      <Routes>
        <Route path='/' element={<Navigate to='/todolists' />} />
        <Route path='/login' element={<LogIn />} />
        <Route path='/todolists' element={<TodoListsList />} />
        <Route path='*' element={<Navigate to='/' />} /> {/* 404 page */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
