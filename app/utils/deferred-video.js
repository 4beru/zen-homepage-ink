/**
 * Load a video whose <source> URLs are stored in data-src until it is needed.
 * Assigning sources lazily prevents hidden slides from competing for bandwidth.
 */
export async function loadDeferredVideo(video, { play = false, preload = "auto" } = {}) {
  if (!video) return false;

  video.preload = preload;

  const deferredPoster = video.getAttribute("data-poster");
  if (deferredPoster && !video.getAttribute("poster")) {
    video.setAttribute("poster", deferredPoster);
    video.removeAttribute("data-poster");
  }

  let sourcesChanged = false;
  for (const source of video.querySelectorAll("source[data-src]")) {
    const deferredSrc = source.getAttribute("data-src");
    if (!deferredSrc || source.getAttribute("src")) continue;

    source.setAttribute("src", deferredSrc);
    source.removeAttribute("data-src");
    sourcesChanged = true;
  }

  if (sourcesChanged) {
    video.load();
  }

  if (!play) return true;

  try {
    await video.play();
    return true;
  } catch {
    // Autoplay may be rejected on some browsers or under data-saving policies.
    return false;
  }
}
