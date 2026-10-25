import tailwindcss from "@tailwindcss/vite";

const isVercelPreview = process.env.VERCEL_ENV === "preview";
const vercelHost = isVercelPreview
  ? process.env.VERCEL_URL
  : process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
const inferredAppUrl = vercelHost ? `https://${vercelHost}` : "http://localhost:3000";
const appUrl = (isVercelPreview ? inferredAppUrl : process.env.APP_URL || inferredAppUrl)
  .replace(/\/+$/, "");

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
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
  image: {
    // Permit Nuxt Image/IPX to optimize the externally hosted portfolio images.
    domains: ["cdn.zenspace.lat"],
  },
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
      sqliteConnector: "native",
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
        language: "en",
        file: "en.json",
      },
      {
        code: "es",
        name: "Spanish",
        language: "es",
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
      references: {
        en: "/references",
        es: "/referencias",
        "zh-CN": "/灵感参考",
      },
      services: {
        en: "/services",
        es: "/servicios",
        "zh-CN": "/服务",
      },
      projects: {
        en: "/projects",
        es: "/proyectos",
        "zh-CN": "/作品",
      },
      "projects-slug": {
        en: "/projects/[slug]",
        es: "/proyectos/[slug]",
        "zh-CN": "/作品/[slug]",
      },
      "privacy-policy": {
        en: "/privacy-policy",
        es: "/politica-de-privacidad",
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
          property: "og:title",
          content: "Zen Space — Creative Software Studio",
        },
        {
          property: "og:description",
          content: "Creative software studio designing and engineering distinctive websites and digital products.",
        },
        {
          property: "og:image",
          content: `${appUrl}/images/logo_circles.png`,
        },
        {
          property: "og:image:alt",
          content: "Zen Space logo",
        },
        {
          property: "og:image:width",
          content: "512",
        },
        {
          property: "og:image:height",
          content: "512",
        },
        {
          property: "og:type",
          content: "website",
        },
        {
          name: "twitter:card",
          content: "summary_large_image",
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
      isPreviewDeployment: isVercelPreview,
      // Empty by default: local and preview builds keep using public/ until the
      // corresponding CDN origin has been verified and configured per environment.
      cdnImagesBaseUrl: "",
      cdnVideosBaseUrl: "",
    },
  },
});
