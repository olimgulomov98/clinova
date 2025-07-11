// plugins/axios.ts
import { ElMessageBox, ElMessage } from "element-plus";
import { defineNuxtPlugin } from "nuxt/app";
import axios from "axios";
import { useCookie } from "nuxt/app";
import { useUserStore } from "../store/auth.store";

export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter();
  const {clearTokens} = useToken();
  // const userStore = useUserStore();
  const config = useRuntimeConfig();
  const settingsStore = useSettingsStore();
  const instance = axios.create({
    baseURL: config.public.apiBase || "http://localhost:8000",
    headers: {
      "Content-Type": "application/json",
      "accept-language": "ru",
      "election-type": "PARELECT",
    },
  });

  // let isRefreshing = false;
  // let refreshSubscribers: Array<(token: string) => void> = [];

  // const subscribeTokenRefresh = (cb: (token: string) => void) => {
  //   refreshSubscribers.push(cb);
  // };

  // const onRefreshed = (token: string) => {
  //   refreshSubscribers.forEach((cb) => cb(token));
  //   refreshSubscribers = [];
  // };

  // const clearCookies = () => {
  //   useCookie("access_token").value = null;
  //   useCookie("refresh_token").value = null;
  // };

  instance.interceptors.request.use((config: any) => {
    const access_token = useCookie("access_token").value;
    if (access_token) {
      config.headers["Authorization"] = `Bearer ${access_token}`;
    } else {
      delete config.headers["Authorization"];
    }
    settingsStore.setLoading(true);
    return config;
  });

  instance.interceptors.response.use(
    (response: any) => {
      settingsStore.setLoading(false);
      return response;
    },
    async (error: any) => {
      settingsStore.setLoading(false);
      const { config, response } = error;
      const request_url = config.url;
      const method = config.method;
      console.log("config", config);
      if (![404].includes(response.status) && !["get"].includes(method)) {
        ElNotification({
          message: response?.data?.message,
          type: "error",
        });
      }

      if ([401].includes(response?.status)) {
        clearTokens();
        router.push('/login')
      }
      return Promise.reject(error)
    }
  );

  nuxtApp.provide("axios", instance);
});

