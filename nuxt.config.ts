import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",

  devtools: {
    enabled: true,
  },

  modules: ["@nuxtjs/seo"],

  site: {
    url: "https://aditianugraha.netlify.app",
    name: "Postman — Frontend Developer",
    description:
      "The digital portfolio of Postman — frontend developer building thoughtful digital experiences.",
    defaultLocale: "en",
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
      htmlAttrs: { lang: "en" },
      title: "Aditia/Postman — Frontend Developer",
      titleTemplate: "%s · Postman",
      meta: [
        { name: "theme-color", content: "#151515" },
        { name: "color-scheme", content: "dark" },
        {
          name: "description",
          content:
            "The portfolio of Postman, a frontend developer building thoughtful digital experiences with Nuxt, React, Next, Vue and modern web technologies.",
        },
        { name: "robots", content: "index, follow" },
      ],
    },
  },

  schemaOrg: {
    identity: {
      type: "Person",
      name: "Aditia Nugraha",
      url: "https://aditianugraha.netlify.app",
      jobTitle: "Frontend Developer",
      description:
        "Frontend developer building thoughtful digital experiences with modern web technologies.",
    },
  },
});