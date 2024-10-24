import { ResponseType } from "../../../common/types/types";
import { instance } from "../../../common/utils/instanse/instanse";

export const authAPI = {
  me() {
    return instance.get<ResponseType<MeResponseType>>("/auth/me");
  },
  logIn(logInData: LogInRequestType) {
    return instance.post<ResponseType<{ userId: number; token: string }>>(
      "/auth/login",
      logInData
    );
  },
  logOut() {
    return instance.delete<ResponseType>("/auth/login");
  },
};

type MeResponseType = {
  id: number;
  email: string;
  login: string;
};

export type LogInRequestType = {
  email: string;
  password: string;
  rememberMe: boolean;
  captcha: boolean;
};
