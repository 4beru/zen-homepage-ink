<template>
  <section ref="servicesPageRef" class="services-page">
    <div class="container services-layout grid grid-cols-1 lg:grid-cols-[clamp(4rem,7vw,7rem)_minmax(0,1fr)] lg:gap-x-8 2xl:gap-x-12">
      <aside ref="filterRef" class="services-aside relative">
        <!-- The spacer reserves room for the fixed mobile glass navigation. -->
        <div class="services-mobile-nav-spacer lg:hidden" aria-hidden="true" />

        <nav class="services-nav-mobile lg:hidden" aria-label="Services navigation">
          <ul ref="mobileFilterRef" class="services-filter-mobile">
            <li v-for="(service, index) in services" :key="service.id">
              <button
                type="button"
                :class="{ 'is-active': activeServiceIndex === index }"
                :aria-current="activeServiceIndex === index ? 'location' : undefined"
                @click="handleClickFilterOption(index)"
              >
                {{ $t(service.titleKey) }}
              </button>
            </li>
          </ul>
        </nav>

        <nav class="hidden lg:block" aria-label="Services navigation">
          <ul ref="desktopFilterRef" class="services-filter-desktop">
            <li v-for="(service, index) in services" :key="service.id">
              <button
                type="button"
                :class="{ 'is-active': activeServiceIndex === index }"
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
        <header class="pt-8 pb-14 sm:pt-12 sm:pb-20 lg:pt-24 lg:pb-24">
          <AnimationReveal class="w-full">
            <p class="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-gray-600 sm:text-sm">
              {{ $t('pages.merch.eyebrow') }}
            </p>
          </AnimationReveal>

          <AnimationReveal class="w-full">
            <h1 class="max-w-5xl text-[clamp(3.2rem,8vw,7.5rem)] leading-[0.9]">
              {{ $t('pages.merch.title') }}
            </h1>
          </AnimationReveal>

          <AnimationReveal class="w-full">
            <p class="mt-6 max-w-3xl text-base font-normal leading-relaxed text-gray-600 sm:mt-8 sm:text-lg lg:text-xl">
              {{ $t('pages.merch.intro') }}
            </p>
          </AnimationReveal>
        </header>

        <div class="services-items flex flex-col gap-24 pb-24 sm:gap-28 md:gap-36 md:pb-40">
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

      const navChars = [
        ...mobileSplits.flatMap((split) => split.chars),
        ...desktopSplits.flatMap((split) => split.chars),
      ];

      if (prefersReducedMotion.value) {
        gsap.set(navChars, { autoAlpha: 1, clearProps: "transform" });
      } else {
        gsap.from(navChars, {
          y: 28,
          autoAlpha: 0,
          duration: 0.75,
          stagger: { each: 0.008, from: "start" },
          ease: "power4.out",
        });
      }

      setActiveSection(0, true);

      services.forEach((service, index) => {
        ScrollTrigger.create({
          trigger: `#${service.id}`,
          start: "top top+=35%",
          end: "bottom top+=35%",
          invalidateOnRefresh: true,
          onEnter: () => setActiveSection(index),
          onEnterBack: () => setActiveSection(index),
        });
      });

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

    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    const activeSize = isDesktop
      ? gsap.utils.clamp(20, 34, Math.min(window.innerWidth * 0.024, window.innerHeight / 26))
      : gsap.utils.clamp(13, 17, Math.min(window.innerWidth * 0.012, window.innerHeight / 38));
    const inactiveSize = isDesktop ? 11 : 10;
    const duration = immediate || prefersReducedMotion.value ? 0 : 0.42;
    const stagger = immediate || prefersReducedMotion.value ? 0 : 0.012;

    for (const splits of [mobileSplits, desktopSplits]) {
      if (previousIndex >= 0 && splits[previousIndex]) {
        gsap.to(splits[previousIndex].chars, {
          fontSize: inactiveSize,
          color: "#111111",
          duration,
          stagger,
          ease: "power2.inOut",
          overwrite: "auto",
        });
      }

      if (splits[index]) {
        gsap.to(splits[index].chars, {
          fontSize: activeSize,
          color: "#cfcfcf",
          duration,
          stagger,
          ease: "power2.inOut",
          overwrite: "auto",
        });
      }
    }
  }

  function handleClickFilterOption(index) {
    const service = services[index];
    if (!service) return;

    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    const offsetY = isDesktop ? 48 : 84;

    gsap.to(window, {
      duration: prefersReducedMotion.value ? 0 : 1.15,
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

<style scoped>
  .services-nav-mobile {
    position: fixed;
    inset: 0 0 auto;
    z-index: 94;
    padding-top: env(safe-area-inset-top);
    background: rgb(255 255 255 / 78%);
    border-bottom: 1px solid rgb(0 0 0 / 8%);
    backdrop-filter: blur(20px) saturate(160%);
    -webkit-backdrop-filter: blur(20px) saturate(160%);
  }

  .services-mobile-nav-spacer {
    height: calc(3.5rem + env(safe-area-inset-top));
  }

  .services-filter-mobile {
    display: flex;
    align-items: center;
    gap: 1.15rem;
    overflow-x: auto;
    padding: 0.8rem 1rem;
    margin: 0;
    list-style: none;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }

  .services-filter-mobile::-webkit-scrollbar {
    display: none;
  }

  .services-filter-mobile button {
    display: block;
    white-space: nowrap;
    text-transform: uppercase;
    font-size: 0.625rem;
    font-weight: 800;
    letter-spacing: 0.12em;
    line-height: 1.1;
    color: #111111;
  }

  .services-filter-desktop {
    position: fixed;
    left: 1.5rem;
    bottom: 2rem;
    z-index: 94;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    gap: clamp(0.45rem, 0.85vw, 0.9rem);
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .services-filter-desktop button {
    display: block;
    inline-size: max-content;
    block-size: max-content;
    writing-mode: vertical-rl;
    text-orientation: mixed;
    transform: rotate(180deg);
    white-space: nowrap;
    text-transform: uppercase;
    text-align: left;
    font-size: 0.6875rem;
    font-weight: 800;
    letter-spacing: 0.055em;
    line-height: 1;
    color: #111111;
    padding: 0.25rem 0.15rem;
    transition: color 300ms ease;
  }

  .service-item {
    scroll-margin-top: 3rem;
  }

  @media (min-width: 1280px) {
    .services-filter-desktop {
      left: 2.5rem;
      bottom: 2.5rem;
    }
  }

  @media (min-width: 1536px) {
    .services-filter-desktop {
      left: 4rem;
      bottom: 3rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .services-nav-mobile,
    .services-filter-mobile button,
    .services-filter-desktop button {
      scroll-behavior: auto;
      transition: none !important;
    }
  }
</style>
