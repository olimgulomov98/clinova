import { remove } from "lodash";

export const useCashierTabStore = defineStore("cashiertab", {
  persist: true,
  state: () => ({
    urls: [] as { name: string; url: string; data?: any }[],
  }),
  actions: {
    setUrl(value: { name: string; url: string; data?: any }) {
      const isDuplicate = this.urls.some(
        (item) => item.url === value.url || value.url === "/cashier-reports"
      );
      const data = { ...value };

      if (!isDuplicate) {
        this.urls.push(data);
      }
    },
    updateData(url: string, data: any) {
      const index = this.urls.findIndex((item) => item.url === url);
      if (index !== -1) {
        this.urls[index].data = data;
      }
    },
    getData(url: string) {
      const index = this.urls.findIndex((item) => item.url === url);
      if (index !== -1) {
        return this.urls[index].data;
      }
      return null;
    },
    removeUrl(url: string) {
      this.urls = this.urls.filter((item) => item.url !== url);
    },
  },
});
