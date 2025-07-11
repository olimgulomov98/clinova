const REFRESH_TOKEN = "refresh_token";
const ACCESS_TOKEN = "access_token";
const ACCESS_TOKEN_EXPIRE = "access_token_expires";
const REFRESH_TOKEN_EXPIRE = "refresh_token_expires";
const ACCESS_SAVE_TIME = "access_save_time";
const REFRESH_SAVE_TIME = "refresh_save_time";
const PRISENT_TIME = 0.9;
const MS_PER_MINUTE = 60 * 1000;

export const useToken = () => {
  const userStore = useUserStore();
  const accessCookie = useCookie<string | null>(ACCESS_TOKEN);
  const refreshCookie = useCookie<string | null>(REFRESH_TOKEN);
  const accessExpireTime = useCookie<string | null>(ACCESS_TOKEN_EXPIRE);
  const refreshExpireTime = useCookie<string | null>(REFRESH_TOKEN_EXPIRE);
  const accessSaveTime = useCookie<string | null>(ACCESS_SAVE_TIME);
  const refreshSaveTime = useCookie<string | null>(REFRESH_SAVE_TIME);
  const setAccessToken = (token: string | null) => {
    setAccessSaveTime();
    accessCookie.value = token;
  };
  const setRefreshToken = (token: string | null) => {
    setRefreshSaveTime();
    refreshCookie.value = token;
  };

  const getAccessToken = () => {
    return accessCookie.value;
  };
  const getRefreshToken = () => refreshCookie.value;

  const setExpiresDate = (accessTime: string | number, refreshTime: string | number) => {
    accessExpireTime.value = accessTime + "";
    refreshExpireTime.value = refreshTime + "";
  };

  const getExpiresDate = (): any => {
    return {
      accessExpireTime: accessExpireTime.value || 0,
      refreshExpireTime: refreshExpireTime.value || 0,
    };
  };

  const setAccessSaveTime = () => {
    const now = new Date();
    const pastTime = new Date(now.getTime() - 26.5 * 60 * 1000);
    accessSaveTime.value = now.toISOString();
  };
  const setRefreshSaveTime = () => {
    const now = new Date();
    const pastTime = new Date(now.getTime() - 26.5 * 60 * 1000);
    refreshSaveTime.value = now.toISOString();
  };
  const getAccessSaveTime = (): string => accessSaveTime.value || "";
  const getRefreshSaveTime = (): string => refreshSaveTime.value || "";

  const checkAccessExpire = () => {
    if (!accessExpireTime.value) return true;
    const interval = new Date().getTime() / MS_PER_MINUTE - new Date(getAccessSaveTime()).getTime() / MS_PER_MINUTE;
    return interval < getExpiresDate().accessExpireTime * PRISENT_TIME;
  };
  const checkRefreshExpire = () => {
    if (!refreshExpireTime.value) return true;
    const interval = new Date().getTime() / MS_PER_MINUTE - new Date(getRefreshSaveTime()).getTime() / MS_PER_MINUTE;
    return interval < getExpiresDate().refreshExpireTime * PRISENT_TIME;
  };

  const clearTokens = () => {
    accessCookie.value = null;
    refreshCookie.value = null;
    refreshExpireTime.value = null;
    accessExpireTime.value = null;
    accessSaveTime.value = null;
    refreshSaveTime.value = null;
    userStore.setUserLogin(false);
    userStore.clearUser();

  };

  return {
    setAccessToken,
    getAccessToken,
    setRefreshToken,
    getRefreshToken,
    clearTokens,
    setExpiresDate,
    checkAccessExpire,
    checkRefreshExpire,
  };
};
