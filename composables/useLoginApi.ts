import type { Axios } from "axios";

let isLogin = false;
export const useLoginApi = () => {
  const { auth } = useConfig();
  const { login_api, expires_date } = auth;
  const router = useRouter();
  const userStore = useUserStore();
  const { $axios } = useNuxtApp();
  const { setAccessToken, setRefreshToken, setExpiresDate } = useToken();
  setExpiresDate(expires_date.access, expires_date.refresh);

  const userLogin = (form: any) => {
    (<Axios>$axios)
      .post(login_api, form)
      .then((response: any) => {
        console.log("response",response)
        handleSuccessfulLogin(response.data).then((res) => {
          console.log(res)
        });
      })
      .catch((error: any) => {
        console.log("error", error);
      });
  };
  const getUserInfo = async () => {
    isLogin = !userStore.isAuthenticated
    if (isLogin) return;
    (<Axios>$axios).get<any>("/api/auth/user/fetch").then((res) => {
      userStore.setUserInfo(res?.data?.payload);
      isLogin = true;
    });
  };

  const handleSuccessfulLogin = async (response: any) => {
    return new Promise(async (resolve, reject) => {
      try {
        setAccessToken(response?.payload);
        await getUserInfo()
        // setRefreshToken(response.refresh);
        userStore.setUserLogin(true);
        router.push(useNavigations()?.[0]?.to || '/');
        resolve("success");
      } catch (error) {
        reject(error);
      }
    });
  };
  return {
    userLogin,
    getUserInfo
  };
};
