export const useSettingsStore = defineStore("settings", {
  state: () => ({
    loading: false,
  }),
  actions: {
    setLoading(val: boolean) {
      this.loading = val;
    },
  },
});
