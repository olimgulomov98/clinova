const isAuthenticated = useCookie<string | null>("isAuthenticated");
export const useUserStore = defineStore("user", {
  persist: true,
  state: () => ({
    userInfo: null as any | null,
    isAuthenticated: Boolean(isAuthenticated.value),
  }),
  getters: {
    userRoles(state) {
      return state.userInfo?.authorities?.map((item: any) => item?.authority) || "";
    },
  },

  actions: {
    setUserInfo(userInfo: any | null) {
      this.userInfo = userInfo;
    },
    setUserLogin(value: boolean) {
      this.isAuthenticated = value;
      isAuthenticated.value = value.toString();
    },
    clearUser() {
      this.userInfo = null;
      useCookie("access_token").value = null;
      useCookie("refresh_token").value = null;
      this.setUserLogin(false);
    },
  },
});
