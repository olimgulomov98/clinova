import { remove } from "lodash";

export const useUrlTabStore = defineStore("tab", {
  persist: true,
  state: () => ({
    urls: [] as { name: string; url: string; data?: any }[],
  }),
  actions: {
    setUrl(value: { name: string; url: string; data?: any }) {
      const isDuplicate = this.urls.some((item) => item.url === value.url || value.url === "/patients");
      const data = { ...value };

      const generateName = (prefix: string) => {
        const items = this.urls
          .filter((item) => item.name.startsWith(prefix))
          .map((item) => parseInt(item.name.slice(1)))
          .filter((num) => !isNaN(num));
        const max = items.length > 0 ? Math.max(...items) + 1 : 1;
        return `${prefix}${String(max).padStart(3, "0")}`;
      };

      if (value.name === "P") {
        data.name = generateName("P");
      } else if (value.name === "V") {
        data.name = generateName("V");
      }
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
    updateUrl(oldUrl: string, url: string) {
      const index = this.urls.findIndex((item) => item.url === oldUrl);
      if (index !== -1) {
        this.urls[index].url = url;
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
