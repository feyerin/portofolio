
import tailwindcss from "@tailwindcss/vite";
import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",

  devtools: {
    enabled: true,
  },

  css: [
    "@fontsource-variable/space-grotesk/index.css",
    "@fontsource-variable/inter/index.css",
    "@fontsource/ibm-plex-mono/400.css",
    "@fontsource/ibm-plex-mono/500.css",
    "@fontsource/cormorant-garamond/400.css",
    "@fontsource/cormorant-garamond/500.css",
    "@fontsource/cormorant-garamond/600.css",
    "@fontsource/cormorant-garamond/400-italic.css",
    "~/assets/css/main.css",
    "~/assets/css/atmos.css",
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  app: {
    head: {
      htmlAttrs: {
        lang: "en",
      },
      meta: [
        {
          name: "theme-color",
          content: "#151515",
        },
        {
          name: "color-scheme",
          content: "dark",
        },
        {
          name: "description",
          content:
            "The digital portfolio of Postman — frontend developer building thoughtful digital experiences.",
        },
      ],
    },
  },
});
