import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RequestStatusType } from "../../common/types/types";
import { authAPI } from "../../features/auth/api/authAPI";
import { ResponseStatus } from "../../common/enums/enums";
import { setIsLoggedIn } from "../../features/auth/model/authSlice";

const initialState: initialStateType = {
  status: "idle",
  error: null,
  isInitialized: false,
};
type initialStateType = {
  status: RequestStatusType;
  error: string | null;
  isInitialized: boolean;
};

const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setAppStatus: (
      state,
      action: PayloadAction<{ status: RequestStatusType }>
    ) => {
      state.status = action.payload.status;
    },
    setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
      state.error = action.payload.error;
    },
    setAppInitialized: (state, action) => {
      state.isInitialized = action.payload.isInitialized;
    },
  },
});

export const initializedApp = createAsyncThunk(
  `${slice.name}/initialization`,
  async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      const response = await authAPI.me();
      if (response.data.resultCode === ResponseStatus.Success) {
        dispatch(setIsLoggedIn({ isLoggedIn: true }));
      } else {
        rejectWithValue(null);
      }
    } catch (e) {
      return rejectWithValue(null);
    }
    dispatch(setAppInitialized({ isInitialized: true }));
  }
);

export const appReducer = slice.reducer;
export const appThunk = { initializedApp };
export const { setAppStatus, setAppError, setAppInitialized } = slice.actions;
