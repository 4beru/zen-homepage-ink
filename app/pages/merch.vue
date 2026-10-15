<template>
  <section ref="servicesPageRef" class="services-page bg-black text-white">
    <div class="container grid grid-cols-1 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-x-8 xl:grid-cols-[18rem_minmax(0,1fr)] xl:gap-x-10 2xl:grid-cols-[20rem_minmax(0,1fr)] 2xl:gap-x-12">
      <aside class="relative">
        <!-- Mobile: reserve space for the fixed translucent navigation. -->
        <div class="h-[calc(3.5rem+env(safe-area-inset-top))] lg:hidden" aria-hidden="true" />

        <nav
          class="fixed inset-x-0 top-0 z-[93] border-b border-white/10 bg-black/[0.88] pt-[env(safe-area-inset-top)] backdrop-blur-xl backdrop-saturate-150 lg:hidden"
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
                :aria-label="$t(service.titleKey)"
                :aria-current="activeServiceIndex === index ? 'location' : undefined"
                @click="handleClickFilterOption(index)"
              >
                <span class="service-nav-label whitespace-nowrap">{{ $t(service.navTitleKey) }}</span>
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
                class="block whitespace-normal text-xl font-extrabold uppercase leading-none tracking-[0.055em] text-white [writing-mode:vertical-rl] [text-orientation:mixed] [transform:rotate(180deg)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary md:text-[1.8rem]"
                :aria-label="$t(service.titleKey)"
                :aria-current="activeServiceIndex === index ? 'location' : undefined"
                @click="handleClickFilterOption(index)"
              >
                <span class="service-nav-label block max-h-[calc(100dvh-5rem)] whitespace-normal">{{ $t(service.navTitleKey) }}</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <div class="min-w-0 relative z-[94]">
        <header class="pt-8 pb-4 sm:pt-12 sm:pb-5 lg:pt-24 lg:pb-5">
          <AnimationReveal class="w-full">
            <p class="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#bdbdbd] sm:text-sm">
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

      // Split only the visible label wrapper; the button keeps a stable accessible name.
      mobileSplits = mobileButtons.map((button) =>
        SplitText.create(button.querySelector(".service-nav-label") ?? button, {
          type: "chars",
          charsClass: "service-nav-char",
        })
      );
      desktopSplits = desktopButtons.map((button) =>
        SplitText.create(button.querySelector(".service-nav-label") ?? button, {
          type: "chars",
          charsClass: "service-nav-char",
        })
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

      // Desktop uses the original trigger point (25%), mobile keeps its own (35%).
      const triggerOffset = () => (window.matchMedia("(min-width: 1024px)").matches ? "top+=25%" : "top+=35%");

      services.forEach((service, index) => {
        ScrollTrigger.create({
          trigger: `#${service.id}`,
          start: () => `top ${triggerOffset()}`,
          end: () => `bottom ${triggerOffset()}`,
          endTrigger: `#${service.id}`,
          invalidateOnRefresh: true, // Safari needs this.
          onEnter: () => {
            if (navIntroComplete) setActiveSection(index);
          },
          onEnterBack: () => {
            if (navIntroComplete) setActiveSection(index);
          },
        });
      });

      // Triggers del blur: misma lógica que el aside, pero en una línea más alta
      // (FOCUS_LINE), así el foco cambia antes de que se ejecute la animación del título.
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

      // Refresh section triggers after fonts, images and layout have settled.
      // The desktop navigation's position is handled by CSS sticky.
      ScrollTrigger.refresh();
    }, servicesPageRef.value);
  });

  onUnmounted(() => {
    gsap.killTweensOf(serviceBlocks);
    ctx?.revert();
    mobileSplits.forEach((split) => split.revert());
    desktopSplits.forEach((split) => split.revert());
  });

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
        color: "#A3A3A3",
        duration: instant ? 0 : 0.42,
        stagger: instant ? 0 : 0.012,
        ease: "power2.inOut",
        overwrite: "auto",
      });
    }

    // ---------- Desktop (same as the original merch page) ----------
    // Keep the active word within the available viewport height. Since aside labels
    // use at most two short words, each word can occupy its own vertical column.
    const navTitle = t(services[index].navTitleKey ?? services[index].titleKey);
    const longestWordLength = Math.max(
      1,
      ...navTitle.trim().split(/\s+/).map((word) => word.length),
    );
    const availableHeight = Math.max(220, window.innerHeight - 80);
    const viewportFitSize = availableHeight / (longestWordLength * 0.62);
    const fontSizeNext = gsap.utils.clamp(
      41.6,
      192,
      Math.min(window.innerWidth * 0.1, viewportFitSize),
    );
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
          color: "#A3A3A3",
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
      onComplete: () => setActiveSection(index),
    });
  }
</script>
