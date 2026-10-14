<template>
  <section ref="servicesPageRef" class="services-page">
    <div class="container grid grid-cols-1 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-x-8 xl:grid-cols-[18rem_minmax(0,1fr)] xl:gap-x-10 2xl:grid-cols-[20rem_minmax(0,1fr)] 2xl:gap-x-12">
      <aside class="relative">
        <!-- Mobile: reserve space for the fixed translucent navigation. -->
        <div class="h-[calc(3.5rem+env(safe-area-inset-top))] lg:hidden" aria-hidden="true" />

        <nav
          class="fixed inset-x-0 top-0 z-[94] border-b border-black/10 bg-white/[0.82] pt-[env(safe-area-inset-top)] backdrop-blur-xl backdrop-saturate-150 lg:hidden"
          aria-label="Services navigation"
        >
          <ul
            ref="mobileFilterRef"
            class="m-0 flex list-none items-center gap-[1.15rem] overflow-x-auto px-4 py-3 [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden"
          >
            <li v-for="(service, index) in services" :key="service.id" class="shrink-0">
              <button
                type="button"
                class="block whitespace-nowrap text-[0.625rem] font-extrabold uppercase leading-[1.1] tracking-[0.12em] text-[#111111] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                :aria-current="activeServiceIndex === index ? 'location' : undefined"
                @click="handleClickFilterOption(index)"
              >
                {{ $t(service.titleKey) }}
              </button>
            </li>
          </ul>
        </nav>

        <nav class="hidden lg:block" aria-label="Services navigation">
          <ul
            ref="desktopFilterRef"
            class="fixed bottom-8 left-4 z-[94] m-0 flex list-none flex-row items-end gap-2 p-0 lg:left-20 xl:gap-3 2xl:bottom-12 2xl:left-24"
          >
            <li v-for="(service, index) in services" :key="service.id" class="shrink-0">
              <button
                type="button"
                class="block w-max whitespace-nowrap text-xl font-extrabold uppercase leading-none tracking-[0.055em] text-black [writing-mode:vertical-rl] [text-orientation:mixed] [transform:rotate(180deg)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary md:text-[1.8rem]"
                :aria-current="activeServiceIndex === index ? 'location' : undefined"
                @click="handleClickFilterOption(index)"
              >
                {{ $t(service.titleKey) }}
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <div class="min-w-0">
        <header class="pt-8 pb-14 sm:pt-12 sm:pb-20 lg:pt-24 lg:pb-2">
          <AnimationReveal class="w-full">
            <p class="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-gray-600 sm:text-sm">
              {{ $t('pages.merch.eyebrow') }}
            </p>
          </AnimationReveal>

        </header>

        <div class="flex flex-col gap-24 pb-24 sm:gap-28 md:gap-36 md:pb-40">
          <MerchItem
            v-for="(service, index) in services"
            :key="service.id"
            :service="service"
            :index="index"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  import { services } from "~/data/merch";
  import { pageTransitionConfig } from "~/helpers/transitionConfig";
  import gsap from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";
  import { ScrollToPlugin } from "gsap/ScrollToPlugin";
  import { SplitText } from "gsap/SplitText";

  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText);

  definePageMeta({
    pageTransition: pageTransitionConfig,
  });

  const { t } = useI18n();
  const servicesPageRef = useTemplateRef("servicesPageRef");
  const mobileFilterRef = useTemplateRef("mobileFilterRef");
  const desktopFilterRef = useTemplateRef("desktopFilterRef");

  const activeServiceIndex = ref(-1);
  const prefersReducedMotion = ref(false);

  let mobileSplits = [];
  let desktopSplits = [];
  let ctx;

  useSeoMeta({
    title: `${t("pages.merch.meta.title")} | ${t("siteName")}`,
    description: t("pages.merch.meta.description"),
    ogTitle: `${t("pages.merch.meta.title")} | ${t("siteName")}`,
    ogDescription: t("pages.merch.meta.description"),
  });

  onMounted(async () => {
    await nextTick();
    await document.fonts.ready;

    prefersReducedMotion.value = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    ctx = gsap.context(() => {
      const mobileButtons = [...(mobileFilterRef.value?.querySelectorAll("button") ?? [])];
      const desktopButtons = [...(desktopFilterRef.value?.querySelectorAll("button") ?? [])];

      mobileSplits = mobileButtons.map((button) =>
        SplitText.create(button, { type: "chars", charsClass: "service-nav-char" })
      );
      desktopSplits = desktopButtons.map((button) =>
        SplitText.create(button, { type: "chars", charsClass: "service-nav-char" })
      );

      const mobileChars = mobileSplits.flatMap((split) => split.chars);
      const desktopChars = desktopSplits.flatMap((split) => split.chars);
      const navChars = [...mobileChars, ...desktopChars];

      // Set explicit starting sizes so GSAP motion stays aligned with Tailwind sizing.
      gsap.set(mobileChars, { fontSize: "0.625rem", color: "#111111" });
      gsap.set(desktopChars, { fontSize: "1.8rem", color: "#000" });

      if (prefersReducedMotion.value) {
        gsap.set(navChars, { autoAlpha: 1, clearProps: "transform" });
      } else {
        gsap.from(navChars, {
          y: 24,
          autoAlpha: 0,
          duration: 0.75,
          stagger: { each: 0.008, from: "start" },
          ease: "power4.out",
        });
      }

      setActiveSection(0, true);

      // Desktop uses the original trigger point (25%), mobile keeps its own (35%).
      const triggerOffset = () => (window.matchMedia("(min-width: 1024px)").matches ? "top+=25%" : "top+=35%");

      services.forEach((service, index) => {
        ScrollTrigger.create({
          trigger: `#${service.id}`,
          start: () => `top ${triggerOffset()}`,
          end: () => `bottom ${triggerOffset()}`,
          endTrigger: `#${service.id}`,
          invalidateOnRefresh: true, // Safari needs this.
          onEnter: () => setActiveSection(index),
          onEnterBack: () => setActiveSection(index),
        });
      });

      // Safari needs this.
      ScrollTrigger.refresh();
    }, servicesPageRef.value);
  });

  onUnmounted(() => {
    ctx?.revert();
    mobileSplits.forEach((split) => split.revert());
    desktopSplits.forEach((split) => split.revert());
  });

  function setActiveSection(index, immediate = false) {
    if (index < 0 || index >= services.length || index === activeServiceIndex.value) return;

    const previousIndex = activeServiceIndex.value;
    activeServiceIndex.value = index;
    const instant = immediate || prefersReducedMotion.value;

    // ---------- Mobile (unchanged) ----------
    const mobileActiveSize = gsap.utils.clamp(13, 17, Math.min(window.innerWidth * 0.012, window.innerHeight / 38));

    if (previousIndex >= 0 && mobileSplits[previousIndex]) {
      gsap.to(mobileSplits[previousIndex].chars, {
        fontSize: 10,
        color: "#111111",
        duration: instant ? 0 : 0.42,
        stagger: instant ? 0 : 0.012,
        ease: "power2.inOut",
        overwrite: "auto",
      });
    }

    if (mobileSplits[index]) {
      gsap.to(mobileSplits[index].chars, {
        fontSize: mobileActiveSize,
        color: "#616161",
        duration: instant ? 0 : 0.42,
        stagger: instant ? 0 : 0.012,
        ease: "power2.inOut",
        overwrite: "auto",
      });
    }

    // ---------- Desktop (same as the original merch page) ----------
    // Matching: font-size: clamp(2.6rem, 10vw, 12rem);
    const clamp = gsap.utils.clamp(41.6, 192); // min 2.6rem, max 12rem - in px.
    const fontSizeNext = clamp(window.innerWidth * 0.1); // 10vw - result in px.
    const tl = gsap.timeline();

    if (previousIndex >= 0 && desktopSplits[previousIndex]) {
      // Shrink previous.
      tl.to(desktopSplits[previousIndex].chars, {
        fontSize: "1.8rem",
        color: "#000",
        duration: instant ? 0 : 0.5,
        stagger: instant ? 0 : 0.03,
        ease: "power2.inOut",
        overwrite: "auto",
      });
    }

    if (desktopSplits[index]) {
      // Grow next.
      tl.to(
        desktopSplits[index].chars,
        {
          fontSize: `${fontSizeNext}px`,
          color: "#cfcfcf",
          duration: instant ? 0 : 0.4,
          stagger: instant ? 0 : 0.03,
          ease: "power2.inOut",
          overwrite: "auto",
        },
        "<"
      );
    }
  }

  function handleClickFilterOption(index) {
    const service = services[index];
    if (!service) return;

    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    // Desktop: original values (1.5s, offset 60). Mobile: keeps the offset for the fixed top nav.
    const offsetY = isDesktop ? 60 : 84;
    const duration = isDesktop ? 1.5 : 1.15;

    gsap.to(window, {
      duration: prefersReducedMotion.value ? 0 : duration,
      scrollTo: {
        y: `#${service.id}`,
        offsetY,
        autoKill: true,
      },
      ease: prefersReducedMotion.value ? "none" : "power4.inOut",
      onComplete: () => setActiveSection(index),
    });
  }
</script>
