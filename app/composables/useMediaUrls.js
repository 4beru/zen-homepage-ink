/**
 * Resolves public media URLs while allowing local assets to remain the safe
 * fallback until the CDN base URLs are configured for an environment.
 *
 * CDN objects currently use flat, filename-only keys (see cdn.md).
 */
function normalizeBaseUrl(value) {
  return typeof value === "string" ? value.trim().replace(/\/+$/, "") : "";
}

function getFilename(value) {
  if (typeof value !== "string") return "";

  const withoutQuery = value.split(/[?#]/, 1)[0];
  return withoutQuery.split("/").filter(Boolean).at(-1) ?? "";
}

function resolveMediaUrl(baseUrl, filename, fallbackUrl) {
  const base = normalizeBaseUrl(baseUrl);
  const name = getFilename(filename);

  if (!base || !name) return fallbackUrl;

  return `${base}/${encodeURIComponent(name)}`;
}

export function useMediaUrls() {
  const config = useRuntimeConfig();
  const { cdnImagesBaseUrl, cdnVideosBaseUrl } = config.public;

  return {
    imageUrl: (filename, fallbackUrl) =>
      resolveMediaUrl(cdnImagesBaseUrl, filename, fallbackUrl),
    videoUrl: (filename, fallbackUrl) =>
      resolveMediaUrl(cdnVideosBaseUrl, filename, fallbackUrl),
  };
}
