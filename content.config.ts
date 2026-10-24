import { defineCollection, defineContentConfig, z } from "@nuxt/content";
import { asSitemapCollection } from "@nuxtjs/sitemap/content";

export default defineContentConfig({
  collections: {
    music: defineCollection(
      asSitemapCollection(
        {
          type: "page",
          source: "**/music/*.md",
          schema: z.object({
            date: z.string(),
          }),
        },
        {
          name: "music",
          onUrl: (url) => {
            // Map each locale's internal Markdown path to the public projects route.
            if (url.loc.startsWith("/en/music/")) {
              url.loc = url.loc.replace("/en/music/", "/projects/");
            } else if (url.loc.startsWith("/es/music/")) {
              url.loc = url.loc.replace("/es/music/", "/proyectos/");
            } else if (url.loc.startsWith("/zh-CN/music/")) {
              url.loc = url.loc.replace("/zh-CN/music/", "/作品/");
            }
          },
        },
      ),
    ),
  },
});
