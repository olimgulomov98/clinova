export const useMainStore = defineStore("main", {
  persist: true,
  state: () => ({
    collapse: false,
  }),
  actions: {
    handleCollapse(value: boolean) {
      this.collapse = value;
    },
  },
});
