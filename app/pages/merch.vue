<template>
  <section
    ref="merchRef"
    class="container relative flex gap-16 justify-end pt-[calc(3.5rem+env(safe-area-inset-top))] lg:pt-[60px]"
  >
    <aside
      ref="filterRef"
      class="merch-filter-wrapper fixed inset-x-0 top-0 z-40 border-b border-black/10 bg-white/[0.82] pt-[env(safe-area-inset-top)] backdrop-blur-xl backdrop-saturate-150 lg:static lg:min-w-0 lg:flex-1 lg:border-0 lg:bg-transparent lg:pt-0 lg:backdrop-filter-none"
      aria-label="Services navigation"
      role="complementary"
    >

      <nav
        class="lg:sticky lg:top-[60px] lg:h-[calc(100dvh-60px)]"
        aria-label="Services navigation"
      >
        <ul
          class="merch-filter m-0 flex list-none items-center gap-[1.15rem] overflow-x-auto px-4 py-3 [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden lg:absolute lg:bottom-8 lg:left-0 lg:items-end lg:gap-2 lg:overflow-visible lg:px-0 lg:py-0 xl:gap-3 2xl:bottom-12"
        >
          <li v-for="(service, index) in filterSections" :key="service.key" class="relative shrink-0">
            <button
              type="button"
              class="block w-max whitespace-nowrap text-[0.625rem] font-extrabold uppercase leading-none tracking-[0.12em] text-[#111111] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary lg:text-[1.8rem] lg:tracking-[0.055em] lg:[writing-mode:vertical-rl] lg:[text-orientation:mixed] lg:[transform:rotate(180deg)]"
              :class="service.key"
              :aria-current="activeFilterSection === service.key ? 'location' : undefined"
              @click="handleClickFilterOption(index)"
            >
              {{ service.label }}
            </button>
          </li>
        </ul>
      </nav>
    </aside>

    <section class="merch-list ml-auto flex w-full flex-col gap-18 md:gap-28 lg:gap-16 lg:w-[76%]">
      <header class="pt-4 sm:pt-6 lg:pt-12">
        <AnimationReveal>
          <p class="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-gray-700 sm:text-sm">
              {{ $t('pages.merch.eyebrow') }}
          </p>
        </AnimationReveal>
      </header>

      <div class="flex flex-col gap-24 pb-16 sm:gap-28 sm:pb-20 md:gap-32 md:pb-24 2xl:gap-36">
        <section
          v-for="(service, serviceIndex) in services"
          :id="service.id"
          :key="service.id"
          class="service-section flex flex-col gap-14 sm:gap-16 lg:gap-20"
          :aria-label="$t(service.titleKey)"
        >
          <h2 class="sr-only">{{ $t(service.titleKey) }}</h2>

          <MerchItem
            v-for="(item, itemIndex) in service.items"
            :key="item.id"
            :item="item"
            :index="serviceIndex * 2 + itemIndex"
            :service-index="serviceIndex"
          />
        </section>
      </div>
    </section>
  </section>
</template>

<script setup>
  import { services } from "~/data/merch";
  import { pageTransitionConfig } from "~/helpers/transitionConfig";

  import gsap from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";
  import { SplitText } from "gsap/SplitText";
  import { ScrollToPlugin } from "gsap/ScrollToPlugin";

  gsap.registerPlugin(SplitText, ScrollTrigger, ScrollToPlugin);

  definePageMeta({
    pageTransition: pageTransitionConfig,
  });

  const { t } = useI18n();
  const merchRef = useTemplateRef("merchRef");
  const filterRef = useTemplateRef("filterRef");

  const filterSections = services.map((service) => ({
    label: t(service.navTitleKey),
    key: service.id,
  }));

  const activeFilterSection = ref(null);
  const prefersReducedMotion = ref(false);

  let ctx;
  let filterSplit;
  let serviceItems = [];
  let focusIndex = -1;
  let isServicesActive = false;
  let navigationTween;

  useSeoMeta({
    title: `${t("pages.merch.meta.title")} | ${t("siteName")}`,
    description: t("pages.merch.meta.description"),
    ogTitle: `${t("pages.merch.meta.title")} | ${t("siteName")}`,
    ogDescription: t("pages.merch.meta.description"),
  });

  onMounted(async () => {
    isServicesActive = true;
    gsap.set(".merch-filter", { autoAlpha: 0 });

    await nextTick();
    await document.fonts.ready;

    // The page can start leaving while fonts are loading. Do not initialize
    // page animations against a detached node or register new ScrollTriggers.
    if (!isServicesActive || !merchRef.value?.isConnected) return;

    prefersReducedMotion.value = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    ctx = gsap.context(() => {
      filterSplit = SplitText.create(".merch-filter li button", {
        type: "chars",
        charsClass: "char",
      });

      const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
      gsap.set(filterSplit.chars, {
        fontSize: isDesktop ? "1.8rem" : "0.625rem",
        color: "#111111",
      });

      gsap.set(".merch-filter", { autoAlpha: 1 });
      serviceItems = gsap.utils.toArray(".service-item", merchRef.value);

      setFocusItem(getActiveItemIndex(), true);

      const createScrollTriggers = () => {
        if (!isServicesActive) return;

        filterSections.forEach((section, index) => {
          const trigger = merchRef.value.querySelector(`#${section.key}`);
          if (!trigger) return;

          ScrollTrigger.create({
            trigger,
            start: () => `top top+=${getActivationLine()}%`,
            end: () => `bottom top+=${getActivationLine()}%`,
            invalidateOnRefresh: true,
            onEnter: () => runInServicesContext(() => setActiveSection(index)),
            onEnterBack: () => runInServicesContext(() => setActiveSection(index)),
          });
        });

        serviceItems.forEach((item, index) => {
          ScrollTrigger.create({
            trigger: item,
            start: () => `top top+=${getActivationLine()}%`,
            end: () => `bottom top+=${getActivationLine()}%`,
            invalidateOnRefresh: true,
            onEnter: () => runInServicesContext(() => setFocusItem(index)),
            onEnterBack: () => runInServicesContext(() => setFocusItem(index)),
          });
        });

        ScrollTrigger.refresh();
      };

      if (prefersReducedMotion.value) {
        gsap.set(filterSplit.chars, { y: 0, autoAlpha: 1 });
        createScrollTriggers();
      } else {
        gsap.set(filterSplit.chars, { y: 60, autoAlpha: 0 });
        gsap.timeline({
          onComplete: createScrollTriggers,
        }).to(filterSplit.chars, {
          delay: 0.5,
          y: 0,
          autoAlpha: 1,
          duration: 1,
          stagger: { each: 0.008, from: "start" },
          ease: "power4.out",
        });
      }
    }, merchRef.value);
  });

  onBeforeRouteLeave(() => {
    isServicesActive = false;
    navigationTween?.kill();

    const aside = filterRef.value;
    if (!aside) return;

    if (window.matchMedia("(min-width: 1024px)").matches) {
      const nav = aside.querySelector("nav");
      if (!nav) return;
      const offset = nav.getBoundingClientRect().top - aside.getBoundingClientRect().top;
      nav.style.position = "relative";
      nav.style.top = `${offset}px`;
    } else {
      aside.style.top = `${window.scrollY + aside.offsetTop}px`;
    }
  });

  onBeforeUnmount(() => {
    isServicesActive = false;
    navigationTween?.kill();
  });

  onUnmounted(() => {
    navigationTween?.kill();
    ctx?.revert();
    filterSplit?.revert();
  });

  function runInServicesContext(callback) {
    if (!isServicesActive) return;

    if (ctx) ctx.add(callback);
    else callback();
  }

  function getActivationLine() {
    return window.matchMedia("(min-width: 1024px)").matches ? 25 : 35;
  }

  function getActiveItemIndex() {
    const activationY = window.innerHeight * (getActivationLine() / 100);
    let lastPassedIndex = 0;

    for (let index = 0; index < serviceItems.length; index += 1) {
      const bounds = serviceItems[index].getBoundingClientRect();

      if (bounds.top <= activationY) lastPassedIndex = index;
      if (bounds.top <= activationY && bounds.bottom > activationY) return index;
    }

    return lastPassedIndex;
  }

  function setFocusItem(index, immediate = false) {
    if (!isServicesActive || index < 0 || index >= serviceItems.length) return;
    if (index === focusIndex && !immediate) return;

    focusIndex = index;
    const blurPx = window.matchMedia("(min-width: 1024px)").matches ? 8 : 5;
    const shouldAnimate = !immediate && !prefersReducedMotion.value;

    serviceItems.forEach((item, itemIndex) => {
      const isActive = itemIndex === index;
      const values = {
        filter: isActive ? "blur(0px)" : `blur(${blurPx}px)`,
        opacity: 1,
      };

      if (shouldAnimate) {
        gsap.to(item, {
          ...values,
          duration: 0.58,
          ease: "power2.out",
          overwrite: "auto",
        });
      } else {
        gsap.set(item, values);
      }
    });
  }

  function setActiveSection(index) {
    if (!isServicesActive || index < 0 || index >= filterSections.length) return;

    const nextSection = filterSections[index].key;
    const previousSection = activeFilterSection.value;

    if (previousSection === nextSection) return;
    activeFilterSection.value = nextSection;

    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    const instant = prefersReducedMotion.value;
    const baseFontSize = isDesktop ? "1.8rem" : "0.625rem";
    const mobileActiveSize = gsap.utils.clamp(
      13,
      17,
      Math.min(window.innerWidth * 0.012, window.innerHeight / 38)
    );
    const clamp = gsap.utils.clamp(41.6, 192);
    const desktopActiveSize = clamp(window.innerWidth * 0.1);
    const nextFontSize = isDesktop ? desktopActiveSize : mobileActiveSize;
    const duration = isDesktop ? 0.4 : 0.42;
    const stagger = isDesktop ? 0.03 : 0.012;

    if (previousSection) {
      gsap.to(`.merch-filter .${previousSection} .char`, {
        fontSize: baseFontSize,
        color: "#111111",
        duration: instant ? 0 : duration,
        stagger: instant ? 0 : stagger,
        ease: "power2.inOut",
        overwrite: "auto",
      });
    }

    gsap.to(`.merch-filter .${nextSection} .char`, {
      fontSize: `${nextFontSize}px`,
      color: "#616161",
      duration: instant ? 0 : duration,
      stagger: instant ? 0 : stagger,
      ease: "power2.inOut",
      overwrite: "auto",
    });
  }

  function handleClickFilterOption(index) {
    const section = filterSections[index];
    if (!section || !isServicesActive) return;

    navigationTween?.kill();

    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    const reducedMotion = prefersReducedMotion.value;

    navigationTween = gsap.to(window, {
      duration: reducedMotion ? 0 : 1.5,
      scrollTo: {
        y: `#${section.key}`,
        offsetY: isDesktop ? 60 : 84,
      },
      ease: "power4.inOut",
      onComplete: () => {
        runInServicesContext(() => {
          const firstItemIndex = serviceItems.findIndex(
            (item) => Number(item.dataset.serviceIndex) === index
          );

          if (firstItemIndex >= 0) setFocusItem(firstItemIndex);
          setActiveSection(index);
        });
      },
    });
  }
</script>
