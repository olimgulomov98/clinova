// https://nuxt.com/docs/api/configuration/nuxt-config
// @ts-ignore
import ru from "element-plus/dist/locale/ru.min.mjs";

export default defineNuxtConfig({
  app: {
    head: {
      title: "Clinova HMS",
      link: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
    },
  },
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: [
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss",
    "@vueuse/nuxt",
    "@formkit/auto-animate",
    "@nuxtjs/i18n",
    "@nuxtjs/device",
    "nuxt-svgo",
    "@element-plus/nuxt",
    "pinia-plugin-persistedstate",
  ],
  css: ["element-plus/dist/index.css", "~/assets/scss/main.scss"],
  ssr: false,

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "https://api.clinix.uz",
    },
  },

  elementPlus: {
    globalConfig: {
      size: "large",
      locale: ru,
    },
  },
  i18n: {
    vueI18n: "./i18n.config.ts",
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {},
      },
    },
  },

  components: {
    dirs: [
      {
        path: "~/components/entities",
        pathPrefix: false,
      },
      {
        path: "~/components/dialogs",
        pathPrefix: false,
      },
      {
        path: "~/components/base",
        pathPrefix: false,
      },
      {
        path: "~/components/layout",
        pathPrefix: false,
      },
      {
        path: "~/components/filters",
        pathPrefix: false,
      },
      {
        path: "~/components",
        pathPrefix: true,
      },
    ],
  },

  svgo: {
    componentPrefix: "icon",
    autoImportPath: "./assets/icons/",
    defaultImport: "component",
    svgoConfig: {
      multipass: true,
      plugins: [
        {
          name: "preset-default",
          params: {
            overrides: {
              // customize default plugin options
              inlineStyles: {
                onlyMatchedOnce: false,
              },

              // or disable plugins
              removeDoctype: false,
              removeViewBox: false,
            },
          },
        },
      ],
    },
  },

  pinia: {
    storesDirs: ["./store/**"],
  },
});
