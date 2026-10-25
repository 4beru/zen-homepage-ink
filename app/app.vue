<template>
  <NuxtRouteAnnouncer />
  <NuxtLoadingIndicator color="repeating-linear-gradient(to right,#ff0047 0%,#ffffff 50%,#00ffc7 100%)" />
  <NuxtLayout>
    <VueLenis ref="lenisRef" :auto-raf="false" root>
      <NuxtPage :page-key="route => route.fullPath" />
    </VueLenis>
  </NuxtLayout>
  <FilmGrain />
  <PageTransitionOverlay />
</template>

<script setup>
  import { VueLenis } from 'lenis/vue';
  import gsap from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";

  // Prevent Firefox (and other browsers) from restoring a stale scroll position
  // before the pinned Home timeline is initialized.
  if (import.meta.client) {
    window.history.scrollRestoration = "manual";
    ScrollTrigger.clearScrollMemory("manual");
  }

  const lenisRef = ref();
  const localeHead = useLocaleHead();
  const runtimeConfig = useRuntimeConfig();

  const canonicalUrl = computed(
    () => localeHead.value.link?.find((link) => link.rel === "canonical")?.href
  );

  // Apply the full locale-aware SEO head, not just the document language.
  // This registers canonical URLs, hreflang alternatives, and Open Graph locale tags.
  useHead(() => ({
    htmlAttrs: {
      lang: localeHead.value.htmlAttrs.lang,
      dir: localeHead.value.htmlAttrs.dir,
    },
    link: [...(localeHead.value.link || [])],
    meta: [
      ...(localeHead.value.meta || []),
      ...(canonicalUrl.value
        ? [{ property: "og:url", content: canonicalUrl.value }]
        : []),
      ...(runtimeConfig.public.isPreviewDeployment
        ? [{ name: "robots", content: "noindex, nofollow" }]
        : []),
    ],
  }));

  onMounted(() => {
    gsap.registerPlugin(ScrollTrigger);
  });

  // Keep Lenis and ScrollTrigger on the same scroll lifecycle.
  watchEffect((onInvalidate) => {
    const lenis = lenisRef.value?.lenis;
    if (!lenis) return;

    lenis.on("scroll", ScrollTrigger.update);

    function update(time) {
      lenis.raf(time * 1000);
    }

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    onInvalidate(() => {
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(update);
    });
  });
</script>
