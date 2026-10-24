import { defineEventHandler, setResponseHeader } from "h3";

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event);
  const siteUrl = String(config.public.appUrl).replace(/\/+$/, "");

  setResponseHeader(event, "content-type", "text/plain; charset=utf-8");

  if (config.public.isPreviewDeployment) {
    return ["User-agent: *", "Disallow: /", ""].join("\n");
  }

  return [
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${siteUrl}/sitemap.xml`,
    "",
  ].join("\n");
});
