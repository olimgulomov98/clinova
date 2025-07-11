export const useSetUrl = (obj: { name: string; url: string }) => {
  const tabStore = useUrlTabStore();
  tabStore.setUrl(obj);
};
