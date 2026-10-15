<template>
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
                :aria-current="activeServiceIndex === index ? 'location' : undefined"
                @click="handleClickFilterOption(index)"
              >
                {{ $t(service.titleKey) }}
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
                :aria-current="activeServiceIndex === index ? 'location' : undefined"
                @click="handleClickFilterOption(index)"
              >
                {{ $t(service.titleKey) }}
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <div
        ref="contentLayoutRef"
        class="min-w-0 relative z-[94] grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_var(--services-title-column-width)] lg:gap-x-[var(--services-title-column-gap)]"
        style="--services-title-column-width: 0px; --services-title-column-gap: 0px;"
      >
        <div class="min-w-0">
        <header class="pt-8 pb-4 sm:pt-12 sm:pb-5 lg:pt-24 lg:pb-5">
          <AnimationReveal class="w-full">
            <p class="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-gray-700 sm:text-sm">
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

        <!-- Desktop-only continuation for the active, oversized navigation title. -->
        <aside
          ref="continuationAsideRef"
          class="relative hidden min-w-0 lg:block"
          aria-hidden="true"
        >
          <div
            ref="continuationViewportRef"
            class="sticky top-[1.2rem] h-[calc(100dvh-1.2rem)]"
          >
            <div
              ref="continuationClipRef"
              class="pointer-events-none absolute left-0 top-[-1.2rem] overflow-hidden"
              style="height: 0px; width: 100%;"
            />
          </div>
        </aside>
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

  const { t } = useI18n();
  const servicesPageRef = useTemplateRef("servicesPageRef");
  const mobileFilterRef = useTemplateRef("mobileFilterRef");
  const desktopFilterRef = useTemplateRef("desktopFilterRef");
  const contentLayoutRef = useTemplateRef("contentLayoutRef");
  const continuationAsideRef = useTemplateRef("continuationAsideRef");
  const continuationViewportRef = useTemplateRef("continuationViewportRef");
  const continuationClipRef = useTemplateRef("continuationClipRef");
  const lenis = useLenis();

  const activeServiceIndex = ref(-1);
  const prefersReducedMotion = ref(false);

  let mobileSplits = [];
  let desktopSplits = [];
  let ctx;
  let navIntroComplete = false;
  let continuationRevealStarted = false;
  let resizeCall;

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

      // Blur the whole service only during its entrance and exit transitions.
      // Keep the complete block sharp through most of its reading time.
      // Skip scroll-driven blur when reduced motion is preferred.
      if (!prefersReducedMotion.value) {
        const serviceBlocks = gsap.utils.toArray(
          "[data-service-block]",
          servicesPageRef.value
        );

        serviceBlocks.forEach((block) => {
          gsap
            .timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: block,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
                invalidateOnRefresh: true,
              },
            })
            .fromTo(
              block,
              { filter: "blur(6px)" },
              { filter: "blur(0px)", duration: 0.1 }
            )
            .to(block, { filter: "blur(0px)", duration: 0.8 })
            .to(block, { filter: "blur(6px)", duration: 0.1 });
        });
      }

      // Refresh section triggers after fonts, images and layout have settled.
      // The desktop navigation's position is handled by CSS sticky.
      ScrollTrigger.refresh();
    }, servicesPageRef.value);

    window.addEventListener("resize", handleServicesResize, { passive: true });
  });

  onUnmounted(() => {
    window.removeEventListener("resize", handleServicesResize);
    resizeCall?.kill();
    continuationClipRef.value?.replaceChildren();
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
    // Matching: font-size: clamp(2.6rem, 10vw, 12rem).
    const fontSizeNext = getDesktopTitleFontSize();
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

    // The continuation copies the active label only after its character sizing
    // has settled, so the duplicate uses the same rendered typography.
    tl.eventCallback("onComplete", () => syncDesktopTitleContinuation(index));
  }

  function getDesktopTitleFontSize() {
    return gsap.utils.clamp(41.6, 192)(window.innerWidth * 0.1);
  }

  function getDesktopTitleColumnGap() {
    if (window.innerWidth >= 1536) return 48;
    if (window.innerWidth >= 1280) return 40;
    return 32;
  }

  function syncDesktopTitleContinuation(index, updateLayout = false) {
    if (
      !window.matchMedia("(min-width: 1024px)").matches ||
      !desktopFilterRef.value ||
      !contentLayoutRef.value ||
      !continuationAsideRef.value ||
      !continuationViewportRef.value ||
      !continuationClipRef.value
    ) {
      return;
    }

    const sourceButton = desktopFilterRef.value.querySelectorAll("button")[index];
    const clip = continuationClipRef.value;
    const layout = contentLayoutRef.value;
    if (!sourceButton) return;

    const sourceBounds = sourceButton.getBoundingClientRect();
    const overflowHeight = Math.max(0, Math.ceil(-sourceBounds.top));

    // Move a visual clone into the reserved third track. The clone is aligned
    // to the source title's original bounds and clipped to only the part that
    // extends beyond the top of the viewport.
    const wrapper = document.createElement("div");
    wrapper.style.position = "absolute";
    wrapper.style.left = "0";
    wrapper.style.top = `${sourceBounds.top}px`;
    wrapper.style.transform = `translateY(${overflowHeight}px)`;
    wrapper.style.pointerEvents = "none";
    wrapper.style.whiteSpace = "nowrap";

    const clone = sourceButton.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    clone.setAttribute("tabindex", "-1");
    clone.removeAttribute("aria-current");
    clone.style.pointerEvents = "none";
    wrapper.appendChild(clone);
    clip.replaceChildren(wrapper);

    if (overflowHeight === 0) {
      gsap.to(clip, {
        height: 0,
        duration: continuationRevealStarted ? 0.25 : 0,
        ease: "power2.out",
        overwrite: "auto",
      });
      return;
    }

    const columnWidth = Math.ceil(sourceBounds.width + 8);
    const columnGap = getDesktopTitleColumnGap();
    const layoutTarget = {
      "--services-title-column-width": `${columnWidth}px`,
      "--services-title-column-gap": `${columnGap}px`,
    };

    if (!continuationRevealStarted) {
      continuationRevealStarted = true;
      gsap.set(layout, {
        "--services-title-column-width": "0px",
        "--services-title-column-gap": "0px",
      });
      gsap.set(clip, { height: 0, autoAlpha: 1 });

      // This is the only entrance animation for the continuation column.
      // After it has appeared, subsequent services only replace its content.
      gsap
        .timeline({
          onComplete: () => ScrollTrigger.refresh(),
        })
        .to(
          layout,
          {
            ...layoutTarget,
            duration: 0.78,
            ease: "power3.inOut",
            overwrite: "auto",
          },
          0
        )
        .to(
          clip,
          {
            height: overflowHeight,
            duration: 0.72,
            ease: "power3.out",
            overwrite: "auto",
          },
          0.12
        );
    } else {
      // Once revealed, keep the third track open. Only resize it when the
      // viewport changes; service-to-service transitions update the clipped text.
      if (updateLayout) {
        gsap.to(layout, {
          ...layoutTarget,
          duration: 0.35,
          ease: "power2.inOut",
          overwrite: "auto",
        });
      }

      gsap.to(clip, {
        height: overflowHeight,
        duration: 0.24,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  }

  function handleServicesResize() {
    resizeCall?.kill();
    resizeCall = gsap.delayedCall(0.16, () => {
      if (
        !window.matchMedia("(min-width: 1024px)").matches ||
        activeServiceIndex.value < 0
      ) {
        return;
      }

      const activeChars = desktopSplits[activeServiceIndex.value]?.chars;
      if (activeChars?.length) {
        gsap.set(activeChars, {
          fontSize: `${getDesktopTitleFontSize()}px`,
          color: "#cfcfcf",
        });
      }

      syncDesktopTitleContinuation(activeServiceIndex.value, true);
      ScrollTrigger.refresh();
    });
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
