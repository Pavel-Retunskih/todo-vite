import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authAPI, LogInRequestType } from "../api/authAPI";
import { setAppError, setAppStatus } from "../../../app/model/appReducer";
import { ResponseStatus } from "../../../common/enums/enums";

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    userId: null as number | null,
  },
  reducers: {
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logIn.fulfilled, (state, action) => {
      const { isLoggedIn, userId } = action.payload;
      state.isLoggedIn = isLoggedIn;
      state.userId = userId;
    });
    builder.addCase(logOut.fulfilled, (state, action) => {
      const { isLoggedIn } = action.payload;
      state.isLoggedIn = isLoggedIn;
      state.userId = null;
    });
  },
});

const logIn = createAsyncThunk<
  { isLoggedIn: boolean; userId: number },
  LogInRequestType
>(`${slice.name}/login`, async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    const response = await authAPI.logIn(arg);
    if (response.data.resultCode === ResponseStatus.Success) {
      localStorage.setItem("sn_token", response.data.data.token);
      return { isLoggedIn: true, userId: response.data.data.userId };
    } else {
      dispatch(setAppError({ error: response.data.messages[0] }));
      console.log(response.data.messages[0]);
      return rejectWithValue(null);
    }
  } catch (e) {
    return rejectWithValue(null);
  }
});
const logOut = createAsyncThunk(`${slice.name}/logOut`, async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    dispatch(setAppStatus({ status: "loading" }));
    const response = await authAPI.logOut();
    if (response.data.resultCode === ResponseStatus.Success) {
      localStorage.removeItem("sn_token");
      dispatch(setAppStatus({ status: "succeeded" }));
      return { isLoggedIn: false };
    } else {
      return rejectWithValue(null);
    }
  } catch (e) {
    return rejectWithValue(null);
  }
});

export const authSlice = slice.reducer;
export const { setIsLoggedIn } = slice.actions;
export const authThunk = { logIn, logOut };
