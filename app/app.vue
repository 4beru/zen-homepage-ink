<template>
  <NuxtRouteAnnouncer />
  <NuxtLoadingIndicator color="repeating-linear-gradient(to right,#ff0047 0%,#ffffff 50%,#00ffc7 100%)" />
  <NuxtLayout>
    <VueLenis ref="lenisRef" :auto-raf="false" root>
      <Html :lang="head.htmlAttrs.lang" :dir="head.htmlAttrs.dir" />
      <NuxtPage :page-key="route => route.fullPath" />
    </VueLenis>
  </NuxtLayout>
  <PageTransitionOverlay />
</template>

<script setup>
  import { VueLenis } from 'lenis/vue';
  import gsap from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";

  const lenisRef = ref()
  const head = useLocaleHead();

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
