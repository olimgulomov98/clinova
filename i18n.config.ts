import uz from "./locales/uz";
import en from "./locales/en";
import ru from "./locales/ru";
export default defineI18nConfig(() => ({
  legacy: true,
  globalInjection: true,
  locale: localStorage.lang || "en",
  messages: {
    uz,
    en,
    ru
  },
}));
