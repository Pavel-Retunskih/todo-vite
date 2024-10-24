import { memo } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../../../common/hooks/hooks";
import { LogInRequestType } from "../../api/authAPI";
import { Navigate } from "react-router-dom";
import { authThunk } from "../../model/authSlice";
import { SnackBar } from "../../../../common/components/SnackBar/SnackBar";

export const LogIn = memo(() => {
  const dispatch = useAppDispatch();
  const error = useAppSelector((state) => state.app.error);
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const { handleSubmit, register } = useForm<LogInRequestType>();
  const onSubmitHandler = (data: LogInRequestType) => {
    dispatch(authThunk.logIn(data));
  };

  if (isLoggedIn) {
    return <Navigate to='/' />;
  }
  return (
    <div className='bg-slate-800 w-full h-screen flex justify-center items-center'>
      <form
        className='p-2 max-w-80 w-full max-h-80 flex gap-6 flex-col text-cyan-300 items-center border-green-300 border rounded-md'
        onSubmit={handleSubmit(onSubmitHandler)}
      >
        <div className='flex w-full items-center justify-between'>
          <label htmlFor='email'>Email</label>
          <input
            className='bg-slate-700 outline-none'
            type='email'
            id='email'
            {...register("email")}
          />
        </div>
        <div className='flex w-full items-center justify-between'>
          <label htmlFor='password'>Password</label>
          <input
            className='bg-slate-700 outline-none'
            type='password'
            id='password'
            {...register("password")}
          />
        </div>
        <div className='flex items-center w-full justify-start gap-24'>
          <label htmlFor='rememberMe'>Remember me</label>
          <input type='checkbox' id='rememberMe' {...register("rememberMe")} />
        </div>

        <button
          className='w-24 border border-green-300 rounded-md bg-slate-800 my-4 py-2 px-6'
          type='submit'
        >
          LogIn
        </button>
      </form>
      <SnackBar message={error} type='error' />
    </div>
  );
});
