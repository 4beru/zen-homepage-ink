import { defineCollection, defineContentConfig } from "@nuxt/content";
import { asSitemapCollection } from "@nuxtjs/sitemap/content";

const projectSlugByContentSlug: Record<string, string> = {
  "video-rock": "rythm",
  velodrome: "unimatic",
  one: "penti-ai",
  gossip: "mira-life",
  "living-room": "subscrr",
};

export default defineContentConfig({
  collections: {
    music: defineCollection(
      asSitemapCollection(
        {
          type: "page",
          source: "**/music/*.md",
        },
        {
          name: "music",
          onUrl: (url) => {
            // Keep locale prefixes while mapping internal Markdown paths to public project routes.
            const routePrefixes = [
              { source: "/en/music/", target: "/projects/" },
              { source: "/es/music/", target: "/es/proyectos/" },
              { source: "/zh-CN/music/", target: "/zh-CN/作品/" },
            ];

            for (const prefix of routePrefixes) {
              if (url.loc.startsWith(prefix.source)) {
                url.loc = url.loc.replace(prefix.source, prefix.target);
                break;
              }
            }

            const lastSlash = url.loc.lastIndexOf("/");
            const contentSlug = url.loc.slice(lastSlash + 1);
            const publicSlug = projectSlugByContentSlug[contentSlug];

            if (publicSlug) {
              url.loc = `${url.loc.slice(0, lastSlash + 1)}${publicSlug}`;
            }
          },
        },
      ),
    ),
  },
});
