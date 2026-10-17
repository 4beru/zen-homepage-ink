<template>
  <!-- Keep one page root so Nuxt can run transition cleanup on every route change. -->
  <div class="services-page-root">
    <section ref="servicesPageRef" class="services-page">
      <div class="container grid grid-cols-1 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-x-8 xl:grid-cols-[18rem_minmax(0,1fr)] xl:gap-x-10 2xl:grid-cols-[20rem_minmax(0,1fr)] 2xl:gap-x-12">
        <aside class="relative">
          <!-- Mobile: reserve space for the fixed translucent navigation. -->
          <div class="h-[calc(3.5rem+env(safe-area-inset-top))] lg:hidden" aria-hidden="true" />

          <nav
            class="fixed inset-x-0 top-0 z-[93] border-b border-black/10 bg-white/[0.82] pt-[env(safe-area-inset-top)] backdrop-blur-xl backdrop-saturate-150 lg:hidden"
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
                  :aria-label="$t(service.titleKey)"
                  :aria-current="activeServiceIndex === index ? 'location' : undefined"
                  @click="handleClickFilterOption(index)"
                >
                  {{ $t(service.navTitleKey) }}
                </button>
              </li>
            </ul>
          </nav>

          <nav
            class="hidden lg:sticky lg:top-[1.2rem] lg:z-[93] lg:block lg:h-[calc(100dvh-1.2rem)]"
            aria-label="Services navigation"
          >
            <ul
              ref="desktopFilterRef"
              class="absolute bottom-8 left-0 m-0 flex list-none flex-row items-end gap-2 p-0 xl:gap-3 2xl:bottom-12"
            >
              <li v-for="(service, index) in services" :key="service.id" class="shrink-0">
                <button
                  type="button"
                  class="block w-max whitespace-nowrap text-xl font-extrabold uppercase leading-none tracking-[0.055em] text-black [writing-mode:vertical-rl] [text-orientation:mixed] [transform:rotate(180deg)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary md:text-[1.8rem]"
                  :aria-label="$t(service.titleKey)"
                  :aria-current="activeServiceIndex === index ? 'location' : undefined"
                  @click="handleClickFilterOption(index)"
                >
                  {{ $t(service.navTitleKey) }}
                </button>
              </li>
            </ul>
          </nav>
        </aside>

        <div class="min-w-0 relative z-[94]">
          <header class="pt-8 pb-4 sm:pt-12 sm:pb-5 lg:pt-24 lg:pb-5">
            <AnimationReveal class="w-full">
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
              data-service-section
              class="flex flex-col gap-14 sm:gap-16 lg:gap-20"
              :aria-label="$t(service.titleKey)"
            >
              <MerchItem
                v-for="(item, itemIndex) in service.items"
                :key="item.id"
                :item="item"
                :index="serviceIndex * 2 + itemIndex"
                :service-index="serviceIndex"
              />
            </section>
          </div>
        </div>
      </div>
    </section>

    <ProjectJourney />
  </div>
</template>

<script setup>
  import { services } from "~/data/merch";
  import { pageTransitionConfig } from "~/helpers/transitionConfig";
  import { useLenis } from "lenis/vue";
  import gsap from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";
  import { SplitText } from "gsap/SplitText";

  gsap.registerPlugin(ScrollTrigger, SplitText);

  definePageMeta({
    pageTransition: pageTransitionConfig,
  });

  // El blur mantiene la misma opacidad y acompaña el cambio de foco del aside.
  const INACTIVE_OPACITY = 1;

  // El blur y el título comparten el mismo disparador; la duración del blur
  // se calcula según la cantidad real de caracteres animados en el aside.

  const { t } = useI18n();
  const servicesPageRef = useTemplateRef("servicesPageRef");
  const mobileFilterRef = useTemplateRef("mobileFilterRef");
  const desktopFilterRef = useTemplateRef("desktopFilterRef");
  const lenis = useLenis();

  const activeServiceIndex = ref(-1);
  const prefersReducedMotion = ref(false);

  let mobileSplits = [];
  let desktopSplits = [];
  let serviceSections = [];
  let serviceItems = [];
  let focusIndex = -1;
  let ctx;
  let navIntroComplete = false;

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

      // El aside sigue trabajando por grupos, pero cada item controla su propio blur.
      serviceSections = gsap.utils.toArray("[data-service-section]", servicesPageRef.value);
      serviceItems = gsap.utils.toArray("[data-service-item]", servicesPageRef.value);

      // Estado inicial: solo el item que cruza el umbral de foco queda nítido.
      setFocusItem(getActiveItemIndex(), 0);

      // Set explicit starting sizes so GSAP motion stays aligned with Tailwind sizing.
      gsap.set(mobileChars, { fontSize: "0.625rem", color: "#111111" });
      gsap.set(desktopChars, { fontSize: "1.8rem", color: "#000" });

      // Reveal every service label in black first. Only after the intro completes
      // do we animate the currently active service to its larger grey state.
      const activateInitialService = () => {
        const activate = () => {
          navIntroComplete = true;
          setActiveSection(getActiveServiceIndex(), prefersReducedMotion.value);
          ScrollTrigger.refresh();
        };

        // Keep animations created by the completion callback inside the page context
        // so ctx.revert() cleans them up when navigating away.
        if (ctx) {
          ctx.add(activate);
        } else {
          activate();
        }
      };

      if (prefersReducedMotion.value) {
        gsap.set(navChars, { autoAlpha: 1, clearProps: "transform" });
        activateInitialService();
      } else {
        gsap
          .timeline({ onComplete: activateInitialService })
          .from(navChars, {
            delay: 0.5,
            y: 60,
            autoAlpha: 0,
            duration: 1,
            stagger: { each: 0.008, from: "start" },
            ease: "power4.out",
          });
      }

      // Un único trigger por título del aside coordina la navegación y el blur.
      // Ambos efectos comienzan al entrar/salir del mismo grupo y con el mismo umbral.
      services.forEach((service, index) => {
        ScrollTrigger.create({
          trigger: `#${service.id}`,
          start: () => `top top+=${getActivationLine()}%`,
          end: () => `bottom top+=${getActivationLine()}%`,
          invalidateOnRefresh: true,
          onEnter: () => activateServiceSection(index),
          onEnterBack: () => activateServiceSection(index),
        });
      });

      // El blur vuelve a dispararse por componente, no por el grupo entero.
      // Se usa el mismo umbral del aside: el primer item de cada grupo cambia de foco
      // en paralelo al título, mientras que el segundo puede enfocarse sin cambiar el aside.
      serviceItems.forEach((item, index) => {
        ScrollTrigger.create({
          trigger: item,
          start: () => `top top+=${getActivationLine()}%`,
          end: () => `bottom top+=${getActivationLine()}%`,
          invalidateOnRefresh: true,
          onEnter: () => setFocusItem(index),
          onEnterBack: () => setFocusItem(index),
        });
      });

      // Refresh section triggers after fonts, images and layout have settled.
      // The desktop navigation's position is handled by CSS sticky.
      ScrollTrigger.refresh();
    }, servicesPageRef.value);
  });

  onUnmounted(() => {
    gsap.killTweensOf(serviceItems);
    ctx?.revert();
    mobileSplits.forEach((split) => split.revert());
    desktopSplits.forEach((split) => split.revert());
  });

  function getActivationLine() {
    return window.matchMedia("(min-width: 1024px)").matches ? 25 : 35;
  }

  function getActiveServiceIndex() {
    const activationY = window.innerHeight * (getActivationLine() / 100);
    let lastPassedIndex = 0;

    for (let index = 0; index < services.length; index += 1) {
      const element = document.getElementById(services[index].id);
      if (!element) continue;

      const bounds = element.getBoundingClientRect();

      if (bounds.top <= activationY) lastPassedIndex = index;
      if (bounds.top <= activationY && bounds.bottom > activationY) return index;
    }

    // If the activation line falls between service groups, keep the last one passed.
    return lastPassedIndex;
  }

  function activateServiceSection(index) {
    // The aside remains grouped by service; item blur is driven by individual triggers.
    if (navIntroComplete) setActiveSection(index);
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

  function getFocusDuration(index) {
    if (focusIndex < 0) return 0;

    const previousItem = serviceItems[focusIndex];
    const nextItem = serviceItems[index];
    const previousServiceIndex = Number(previousItem?.dataset.serviceIndex);
    const nextServiceIndex = Number(nextItem?.dataset.serviceIndex);

    // A transition between the two items of one service doesn't change the aside.
    if (previousServiceIndex === nextServiceIndex) return 0.58;

    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    const splits = isDesktop ? desktopSplits : mobileSplits;
    const previousLength = splits[previousServiceIndex]?.chars.length ?? 0;
    const nextLength = splits[nextServiceIndex]?.chars.length ?? 0;
    const outgoingDuration = isDesktop ? 0.5 : 0.42;
    const incomingDuration = isDesktop ? 0.4 : 0.42;
    const stagger = isDesktop ? 0.03 : 0.012;

    const outgoingEnd = outgoingDuration + Math.max(0, previousLength - 1) * stagger;
    const incomingEnd = incomingDuration + Math.max(0, nextLength - 1) * stagger;

    return Math.max(outgoingEnd, incomingEnd);
  }

  function getFirstItemIndexForService(serviceIndex) {
    return serviceItems.findIndex(
      (item) => Number(item.dataset.serviceIndex) === serviceIndex
    );
  }

  function setFocusItem(index, duration = getFocusDuration(index)) {
    if (prefersReducedMotion.value) return;
    if (index < 0 || index >= serviceItems.length || index === focusIndex) return;

    const previousIndex = focusIndex;
    focusIndex = index;
    setItemFocus(index, previousIndex, duration);
  }

  // Enfoca un único componente. El estado del aside sigue perteneciendo al grupo de servicio.
  function setItemFocus(activeIndex, previousIndex, duration) {
    if (prefersReducedMotion.value || !serviceItems.length) return;

    const blurPx = window.matchMedia("(min-width: 1024px)").matches ? 8 : 5;

    serviceItems.forEach((item, i) => {
      const isActive = i === activeIndex;

      // Solo animamos el item que pierde el foco y el que lo recibe.
      if (previousIndex >= 0 && !isActive && i !== previousIndex) return;

      if (gsap.getProperty(item, "filter") === "none") {
        if (isActive) return;
        gsap.set(item, { filter: "blur(0px)" });
      }

      gsap.to(item, {
        filter: isActive ? "blur(0px)" : `blur(${blurPx}px)`,
        opacity: isActive ? 1 : INACTIVE_OPACITY,
        duration,
        ease: "power2.out",
        overwrite: "auto",
        onComplete: () => {
          if (isActive) gsap.set(item, { clearProps: "filter,opacity" });
        },
      });
    });
  }

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
    const instance = lenis.value;
    if (!service || !instance) return;

    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    // Account for the mobile top bar and keep desktop targets comfortably below the top.
    const offsetY = isDesktop ? 60 : 84;
    const duration = isDesktop ? 1.5 : 1.15;
    const reducedMotion = prefersReducedMotion.value;

    instance.scrollTo(`#${service.id}`, {
      offset: -offsetY,
      duration: reducedMotion ? 0 : duration,
      immediate: reducedMotion,
      easing: (t) =>
        t < 0.5
          ? 8 * t ** 4
          : 1 - Math.pow(-2 * t + 2, 4) / 2,
      onComplete: () => {
        const firstItemIndex = getFirstItemIndexForService(index);
        if (firstItemIndex >= 0) setFocusItem(firstItemIndex);
        setActiveSection(index);
      },
    });
  }
</script>
