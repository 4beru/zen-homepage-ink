import tailwindcss from "@tailwindcss/vite";

const appUrl = process.env.APP_URL || "http://localhost:3000";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false, // Need to disable server-side rendering to prevent error 500 (still working on this).
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  nitro: {
    preset: "node-server",
  },
  devServer: {
    port: 3000,
    host: "0.0.0.0",
  },
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/scripts",
    "lenis/nuxt",
    "@nuxtjs/i18n",
    "@nuxtjs/sitemap",
    "@nuxt/content",
  ],
  components: [
    {
      path: "~/components",
      extensions: [".vue"],
      pathPrefix: false,
      global: true,
    },
  ],
  content: {
    experimental: {
      nativeSqlite: true,
    },
    renderer: {
      anchorLinks: { h2: false, h3: false, h4: false },
    },
  },
  site: {
    url: appUrl,
    name: "Zen Space",
  },
  i18n: {
    baseUrl: appUrl,
    strategy: "prefix_except_default",
    defaultLocale: "en",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
    },
    locales: [
      {
        code: "en",
        name: "English",
        language: "en-GB",
        file: "en.json",
      },
      {
        code: "es",
        name: "Spanish",
        language: "es-ES",
        file: "es.json",
      },
      {
        code: "zh-CN",
        name: "简体中文",
        language: "zh-CN",
        file: "zh-CN.json",
      },
    ],
    customRoutes: "config", // disable custom route with page components
    pages: {
      index: {
        en: "/",
        es: "/",
        "zh-CN": "/首页",
      },
      band: {
        en: "/band",
        es: "/banda",
        "zh-CN": "/灵感",
      },
      merch: {
        en: "/merch",
        es: "/merch",
        "zh-CN": "/服务",
      },
      music: {
        en: "/music",
        es: "/musica",
        "zh-CN": "/作品",
      },
      "music-slug": {
        en: "/music/[slug]",
        es: "/musica/[slug]",
        "zh-CN": "/作品/[slug]",
      },
      privacy: {
        en: "/privacy",
        es: "/privacidad",
        "zh-CN": "/隐私政策",
      },
    },
  },
  app: {
    head: {
      title: "Zen Space — Creative Software Studio",
      meta: [
        {
          name: "description",
          content: "Creative software studio designing and engineering distinctive websites and digital products.",
        },
        {
          name: "og:title",
          content: "Zen Space — Creative Software Studio",
        },
        {
          name: "og:description",
          content: "Creative software studio designing and engineering distinctive websites and digital products.",
        },
        {
          name: "og:image",
          content: `${appUrl}/images/logo_circles.png`,
        },
        {
          name: "og:image:alt",
          content: "Zen Space logo",
        },
        {
          name: "og:image:width",
          content: "512",
        },
        {
          name: "og:image:height",
          content: "512",
        },
        {
          name: "og:url",
          content: appUrl,
        },
        {
          name: "og:type",
          content: "website",
        },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "author", content: "Abel" },
        { name: "generator", content: "Nuxt" },
        { name: "format-detection", content: "telephone=no" },
        { name: "apple-mobile-web-app-title", content: "Zen Space" },
      ],
      link: [
        {
          rel: "icon",
          type: "image/svg+xml",
          media: "(prefers-color-scheme: light)",
          href: "/favicons/favicon-light-mode.svg",
        },
        {
          rel: "icon",
          type: "image/svg+xml",
          media: "(prefers-color-scheme: dark)",
          href: "/favicons/favicon-dark-mode.svg",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "96x96",
          href: "/favicons/favicon-96x96.png",
        },
        // { rel: 'icon', type: 'image/x-icon', href: '/favicons/favicon.ico' },
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          type: "image/x-icon",
          href: "/favicons/apple-touch-icon.png",
        },
        { rel: "manifest", href: "/favicons/site.webmanifest" },
      ],
    },
  },
  fonts: {
    defaults: {
      weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    },
    families: [
      {
        name: "Poppins",
        provider: "google",
        weights: [600, 700, 800, 900],
        display: "swap",
      },
      {
        name: "Noto Sans SC",
        provider: "google",
        weights: ["100 900"],
        subsets: ["chinese-simplified", "latin", "latin-ext"],
        display: "swap",
      },
    ],
  },
  runtimeConfig: {
    public: {
      appUrl,
    },
  },
});
