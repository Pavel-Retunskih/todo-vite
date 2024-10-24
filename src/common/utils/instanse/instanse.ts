import axios from "axios";

export const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1",
  headers: {
    "API-KEY": import.meta.env.VITE_API_KEY,
    Authorization: "Bearer " + import.meta.env.SN_TOKEN,
  },
});
instance.interceptors.request.use(function (config) {
  config.headers["API-KEY"] = import.meta.env.VITE_API_KEY;
  config.headers["Authorization"] =
    "Bearer " + localStorage.getItem("sn_token");
  return config;
});
