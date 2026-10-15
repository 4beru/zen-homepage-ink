<template>
  <section ref="servicesPageRef" class="services-page">
    <div ref="servicesPanelRef" class="services-slide-panel">
      <div ref="servicesPanelVisualRef" class="services-panel-visual">
        <div ref="servicesPanelExitRef" class="services-panel-exit">
          <div ref="servicesPanelLayoutRef" class="container services-panel-layout grid grid-cols-1 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-x-8 xl:grid-cols-[18rem_minmax(0,1fr)] xl:gap-x-10 2xl:grid-cols-[20rem_minmax(0,1fr)] 2xl:gap-x-12" style="padding-block: 0">
      <aside class="relative">
        <!-- Mobile: reserve space for the fixed translucent navigation. -->
        <div class="h-[calc(3.5rem+env(safe-area-inset-top))] lg:hidden" aria-hidden="true" />

        <nav
          class="absolute inset-x-0 top-0 z-[93] border-b border-white/10 bg-black/[0.82] pt-[env(safe-area-inset-top)] backdrop-blur-xl backdrop-saturate-150 lg:hidden"
          aria-label="Services navigation"
        >
          <ul
            ref="mobileFilterRef"
            class="m-0 flex list-none items-center gap-[1.15rem] overflow-x-auto px-4 py-3 [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden"
          >
            <li v-for="(service, index) in services" :key="service.id" class="shrink-0">
              <button
                type="button"
                class="block whitespace-nowrap text-[0.625rem] font-extrabold uppercase leading-[1.1] tracking-[0.12em] text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                :aria-current="activeServiceIndex === index ? 'location' : undefined"
                @click="handleClickFilterOption(index)"
              >
                {{ $t(service.titleKey) }}
              </button>
            </li>
          </ul>
        </nav>

        <nav
          class="hidden lg:absolute lg:left-0 lg:top-0 lg:z-[93] lg:block lg:h-[calc(100dvh-1.2rem)] lg:w-full"
          aria-label="Services navigation"
        >
          <ul
            ref="desktopFilterRef"
            class="absolute bottom-8 left-0 m-0 flex list-none flex-row items-end gap-2 p-0 xl:gap-3 2xl:bottom-12"
          >
            <li v-for="(service, index) in services" :key="service.id" class="shrink-0">
              <button
                type="button"
                class="block w-max whitespace-nowrap text-xl font-extrabold uppercase leading-none tracking-[0.055em] text-white [writing-mode:vertical-rl] [text-orientation:mixed] [transform:rotate(180deg)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary md:text-[1.8rem]"
                :aria-current="activeServiceIndex === index ? 'location' : undefined"
                @click="handleClickFilterOption(index)"
              >
                {{ $t(service.titleKey) }}
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <div ref="servicesPanelInnerRef" class="services-panel-inner min-w-0 relative z-[94] pt-[1.2rem] pb-[1.2rem]">
        <header class="pt-8 pb-4 sm:pt-12 sm:pb-5 lg:pt-24 lg:pb-5">
          <AnimationReveal class="w-full">
            <p class="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-gray-300 sm:text-sm">
              {{ $t('pages.merch.eyebrow') }}
            </p>
          </AnimationReveal>

        </header>

        <div class="flex flex-col gap-24 pb-24 sm:gap-28 md:gap-32 2xl:gap-36 md:pb-40">
          <MerchItem
            v-for="(service, index) in services"
            :key="service.id"
            :service="service"
            :index="index"
          />
        </div>
          </div>
        </div>
      </div>
    </div>
    </div>

    <!-- Full-width follow-up section, separate from the Services two-column block. -->
    <section class="services-follow-up" aria-label="Project Journey and FAQs">
      <div class="container">
        <ProjectJourney />
        <FaqAccordion />
      </div>
    </section>
  </section>
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

  // Opacidad de los bloques fuera de foco. Con 1 solo se aplica blur;
  // bájala (por ejemplo 0.55) si quieres que se lean más "apagados".
  const INACTIVE_OPACITY = 1;

  // Línea de scroll donde cambia el foco del blur, en % de la altura del viewport
  // medido desde arriba (el bloque cambia cuando su borde superior cruza esa línea).
  // Debe ser MAYOR que la línea del aside (25 desktop / 35 mobile) para que el blur
  // cambie ANTES que el título. Súbela para más adelanto, bájala para menos.
  const FOCUS_LINE = { desktop: 55, mobile: 65 };

  // Duración del cambio de blur, en segundos.
  const FOCUS_DURATION = 0.6;

  const { t } = useI18n();
  const servicesPageRef = useTemplateRef("servicesPageRef");
  const servicesPanelRef = useTemplateRef("servicesPanelRef");
  const servicesPanelVisualRef = useTemplateRef("servicesPanelVisualRef");
  const servicesPanelExitRef = useTemplateRef("servicesPanelExitRef");
  const servicesPanelLayoutRef = useTemplateRef("servicesPanelLayoutRef");
  const servicesPanelInnerRef = useTemplateRef("servicesPanelInnerRef");
  const mobileFilterRef = useTemplateRef("mobileFilterRef");
  const desktopFilterRef = useTemplateRef("desktopFilterRef");
  const lenis = useLenis();

  const activeServiceIndex = ref(-1);
  const prefersReducedMotion = ref(false);

  let mobileSplits = [];
  let desktopSplits = [];
  let serviceBlocks = [];
  let focusIndex = -1;
  let ctx;
  let navIntroComplete = false;

  let servicesPanelContext;
  let servicesPanelTimeline;
  let servicesPanelResizeHandler;
  let servicesPanelResizeTimeout;
  let servicesPanelDifference = 0;

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

      // Bloques de contenido (uno por servicio, en el mismo orden que `services`).
      // Su blur es independiente del aside: cambia en su propia línea de scroll (FOCUS_LINE).
      serviceBlocks = gsap.utils.toArray("[data-service-block]", servicesPageRef.value);

      // Estado inicial sin animación: el bloque en foco nítido, el resto desenfocado.
      setFocusSection(getFocusIndex(), 0);

      // Set explicit starting sizes so GSAP motion stays aligned with Tailwind sizing.
      gsap.set(mobileChars, { fontSize: "0.625rem", color: "#ffffff" });
      gsap.set(desktopChars, { fontSize: "1.8rem", color: "#ffffff" });

      // Reveal every service label in white first. Only after the intro completes
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

      if (prefersReducedMotion.value) {
        // Keep ordinary document-scroll tracking when motion is disabled.
        registerNativeServiceTriggers();
        registerNativeFocusTriggers();
      } else {
        // The Services grid becomes one tall panel. Its right column fake-scrolls
        // while the sidebar stays in the pinned viewport; state updates follow
        // the transformed service blocks rather than stale document coordinates.
        buildServicesPanelAnimations();

        servicesPanelResizeHandler = () => {
          window.clearTimeout(servicesPanelResizeTimeout);
          servicesPanelResizeTimeout = window.setTimeout(() => {
            buildServicesPanelAnimations();
          }, 160);
        };
        window.addEventListener("resize", servicesPanelResizeHandler, { passive: true });
      }

      // Refresh after the panel's manual spacing and triggers have been registered.
      ScrollTrigger.refresh();
    }, servicesPageRef.value);
  });

  onUnmounted(() => {
    if (servicesPanelResizeHandler) window.removeEventListener("resize", servicesPanelResizeHandler);
    window.clearTimeout(servicesPanelResizeTimeout);
    gsap.killTweensOf(serviceBlocks);
    servicesPanelContext?.revert();
    ctx?.revert();
    mobileSplits.forEach((split) => split.revert());
    desktopSplits.forEach((split) => split.revert());
    servicesPanelRef.value?.style.removeProperty("margin-bottom");
  });

  function registerNativeServiceTriggers() {
    const triggerOffset = () =>
      window.matchMedia("(min-width: 1024px)").matches ? "top+=25%" : "top+=35%";

    services.forEach((service, index) => {
      ScrollTrigger.create({
        trigger: `#${service.id}`,
        start: () => `top ${triggerOffset()}`,
        end: () => `bottom ${triggerOffset()}`,
        endTrigger: `#${service.id}`,
        invalidateOnRefresh: true,
        onEnter: () => {
          if (navIntroComplete) setActiveSection(index);
        },
        onEnterBack: () => {
          if (navIntroComplete) setActiveSection(index);
        },
      });
    });
  }

  function registerNativeFocusTriggers() {
    serviceBlocks.forEach((block, index) => {
      ScrollTrigger.create({
        trigger: block,
        start: () => `top top+=${getFocusLine()}%`,
        end: () => `bottom top+=${getFocusLine()}%`,
        invalidateOnRefresh: true,
        onEnter: () => setFocusSection(index),
        onEnterBack: () => setFocusSection(index),
      });
    });
  }

  function buildServicesPanelAnimations() {
    servicesPanelContext?.revert();
    servicesPanelTimeline = undefined;

    const panel = servicesPanelRef.value;
    const visual = servicesPanelVisualRef.value;
    const exitLayer = servicesPanelExitRef.value;
    const layout = servicesPanelLayoutRef.value;
    const inner = servicesPanelInnerRef.value;
    if (!panel || !visual || !exitLayer || !layout || !inner) return;

    panel.style.marginBottom = "0px";
    gsap.set(inner, { clearProps: "transform" });
    gsap.set(visual, { clearProps: "transform,opacity" });
    gsap.set(exitLayer, { clearProps: "transform,opacity" });

    const panelHeight = panel.clientHeight || window.innerHeight;
    const contentHeight = Math.max(layout.scrollHeight, layout.offsetHeight);
    const difference = Math.max(0, contentHeight - panelHeight);
    const fakeScrollDuration = difference / panelHeight;

    servicesPanelDifference = difference;
    panel.style.marginBottom = `${difference}px`;
    const serviceTrackingEnd = fakeScrollDuration / (fakeScrollDuration + 1);

    servicesPanelContext = gsap.context(() => {
      gsap.set(visual, { scale: 1, autoAlpha: 1, transformOrigin: "center center" });
      gsap.set(exitLayer, { scale: 1, autoAlpha: 1, transformOrigin: "center center" });

      // Incoming transition. The outgoing fade below is applied to a separate layer,
      // so the two scroll-linked tweens never compete for the same transform.
      gsap.fromTo(
        visual,
        { scale: 0.7, autoAlpha: 0.5 },
        {
          scale: 1,
          autoAlpha: 1,
          ease: "none",
          scrollTrigger: {
            trigger: panel,
            start: "top bottom",
            end: "top top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: "bottom bottom",
          end: () => `+=${Math.max(layout.scrollHeight, panel.clientHeight)}`,
          pin: panel,
          pinSpacing: false,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Stop recalculating the active item while the whole panel is shrinking
            // away; after fake-scroll finishes, its visual transform is no longer a
            // useful signal for which service should be selected.
            if (!navIntroComplete || self.progress > serviceTrackingEnd) return;
            setActiveSection(getActiveServiceIndex());
            setFocusSection(getFocusIndex());
          },
        },
      });

      if (difference > 0) {
        timeline.to(
          inner,
          {
            y: () => -(Math.max(layout.scrollHeight, layout.offsetHeight) - panel.clientHeight),
            duration: fakeScrollDuration,
            ease: "none",
          },
          0,
        );
      }

      // Once every service has travelled through the viewport, shrink/fade the
      // entire Services panel so Project Journey is revealed underneath it.
      timeline
        .to(
          exitLayer,
          { scale: 0.7, autoAlpha: 0.5, duration: 0.9, ease: "none" },
          fakeScrollDuration,
        )
        .to(
          exitLayer,
          { autoAlpha: 0, duration: 0.1, ease: "none" },
          fakeScrollDuration + 0.9,
        );

      servicesPanelTimeline = timeline;
    }, panel);

    ScrollTrigger.refresh();
  }

  function getElementOffsetWithin(element, ancestor) {
    let offset = 0;
    let node = element;

    while (node && node !== ancestor) {
      offset += node.offsetTop || 0;
      node = node.offsetParent;
    }

    return offset;
  }

  function getActiveServiceIndex() {
    const activationRatio = window.matchMedia("(min-width: 1024px)").matches
      ? 0.25
      : 0.35;
    const activationY = window.innerHeight * activationRatio;
    let lastPassedIndex = 0;

    for (let index = 0; index < services.length; index += 1) {
      const element = document.getElementById(services[index].id);
      if (!element) continue;

      const bounds = element.getBoundingClientRect();

      if (bounds.top <= activationY) lastPassedIndex = index;
      if (bounds.top <= activationY && bounds.bottom > activationY) return index;
    }

    // If the activation line falls between service blocks, keep the last one passed.
    return lastPassedIndex;
  }

  function getFocusLine() {
    return window.matchMedia("(min-width: 1024px)").matches
      ? FOCUS_LINE.desktop
      : FOCUS_LINE.mobile;
  }

  // Bloque en foco según la línea de scroll del blur. Si la línea cae entre dos bloques,
  // se mantiene el último que la pasó (misma lógica que getActiveServiceIndex).
  function getFocusIndex() {
    const lineY = window.innerHeight * (getFocusLine() / 100);
    let lastPassedIndex = 0;

    for (let index = 0; index < serviceBlocks.length; index += 1) {
      const bounds = serviceBlocks[index].getBoundingClientRect();

      if (bounds.top <= lineY) lastPassedIndex = index;
      if (bounds.top <= lineY && bounds.bottom > lineY) return index;
    }

    return lastPassedIndex;
  }

  function setFocusSection(index, duration = FOCUS_DURATION) {
    if (prefersReducedMotion.value) return;
    if (index < 0 || index >= serviceBlocks.length || index === focusIndex) return;

    const previousIndex = focusIndex;
    focusIndex = index;
    setBlockFocus(index, previousIndex, duration);
  }

  // Enfoca el bloque activo y desenfoca el resto.
  function setBlockFocus(activeIndex, previousIndex, duration) {
    if (prefersReducedMotion.value || !serviceBlocks.length) return;

    const blurPx = window.matchMedia("(min-width: 1024px)").matches ? 8 : 5;

    serviceBlocks.forEach((block, i) => {
      const isActive = i === activeIndex;

      // Tras la primera llamada solo cambian el bloque que pierde foco y el que lo gana.
      if (previousIndex >= 0 && !isActive && i !== previousIndex) return;

      if (gsap.getProperty(block, "filter") === "none") {
        // Ya está nítido: no hay nada que animar.
        if (isActive) return;
        // GSAP no interpola desde `filter: none`, así que le damos un valor inicial numérico.
        gsap.set(block, { filter: "blur(0px)" });
      }

      gsap.to(block, {
        filter: isActive ? "blur(0px)" : `blur(${blurPx}px)`,
        opacity: isActive ? 1 : INACTIVE_OPACITY,
        duration,
        ease: "power2.out",
        overwrite: "auto",
        onComplete: () => {
          // Sin filtro residual: evita stacking context y mantiene el texto nítido.
          if (isActive) gsap.set(block, { clearProps: "filter,opacity" });
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
        color: "#ffffff",
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
        color: "#ffffff",
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
    const duration = isDesktop ? 1.5 : 1.15;
    const reducedMotion = prefersReducedMotion.value;
    const serviceElement = document.getElementById(service.id);
    const panelTrigger = servicesPanelTimeline?.scrollTrigger;
    let target = `#${service.id}`;
    let offset = isDesktop ? -60 : -84;

    // During the pinned fake-scroll, map a service's content offset to the
    // real document scroll range that ScrollTrigger assigns to the panel.
    if (
      !reducedMotion &&
      serviceElement &&
      panelTrigger &&
      Number.isFinite(panelTrigger.start) &&
      servicesPanelDifference > 0 &&
      servicesPanelLayoutRef.value
    ) {
      const contentOffset = getElementOffsetWithin(serviceElement, servicesPanelLayoutRef.value);
      const activationY = window.innerHeight * (isDesktop ? 0.25 : 0.35);
      const fakeScroll = gsap.utils.clamp(0, servicesPanelDifference, contentOffset - activationY);
      // The pinned trigger maps one document-scroll pixel to one pixel of
      // fake content movement during this phase. Do not normalize by the full
      // pin duration: the final viewport is reserved for the panel handoff.
      target = panelTrigger.start + fakeScroll;
      offset = 0;
    }

    instance.scrollTo(target, {
      offset,
      duration: reducedMotion ? 0 : duration,
      immediate: reducedMotion,
      easing: (t) =>
        t < 0.5
          ? 8 * t ** 4
          : 1 - Math.pow(-2 * t + 2, 4) / 2,
      onComplete: () => setActiveSection(index),
    });
  }
</script>

<style scoped>
  .services-slide-panel {
    position: relative;
    height: 100dvh;
    overflow: hidden;
    background: transparent;
  }

  .services-panel-visual,
  .services-panel-exit {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    transform-origin: center center;
    will-change: transform, opacity;
  }

  .services-panel-exit {
    background: #000;
    color: #fff;
  }

  .services-panel-layout {
    position: relative;
  }

  .services-panel-inner {
    position: relative;
    width: 100%;
    min-width: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    .services-slide-panel {
      height: auto;
      min-height: 0;
      overflow: visible;
      margin-bottom: 0 !important;
    }

    .services-panel-visual,
    .services-panel-exit {
      height: auto;
      overflow: visible;
      transform: none !important;
      opacity: 1 !important;
      will-change: auto;
    }

    .services-panel-inner {
      transform: none !important;
    }

    .services-panel-layout > aside > nav:first-of-type {
      position: fixed;
      top: 0;
      right: 0;
      left: 0;
      width: 100%;
    }

    .services-panel-layout > aside > nav:last-of-type {
      position: sticky;
      top: 1.2rem;
    }
  }
</style>
