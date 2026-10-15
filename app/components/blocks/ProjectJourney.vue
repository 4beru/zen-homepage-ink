<template>
  <!-- Only this follow-up panel is pinned; the Services aside keeps native sticky scrolling. -->
  <div ref="panelRef" class="journey-slide-panel">
    <div ref="panelVisualRef" class="journey-panel-visual">
      <div ref="panelInnerRef" class="journey-panel-inner">
  <section ref="journeyRef" class="project-journey w-full border-t border-black/10 pt-24 pb-8 sm:pt-28 md:pt-36" aria-labelledby="journey-title">
    <!-- Eyebrow -->
    <p class="journey-eyebrow mb-4 text-xs font-bold uppercase tracking-[0.18em] text-gray-700 sm:text-sm">
      {{ $t('pages.merch.journey.eyebrow') }}
    </p>

    <!-- Giant headline with a word-by-word GSAP scroll reveal (same spirit as the home blocks).
         Words slide up from behind a line mask via SplitText lines wrapper. -->
    <h2 ref="titleRef" id="journey-title" class="journey-title max-w-5xl text-[clamp(2.4rem,7vw,4.6rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.01em] text-black">
      {{ $t('pages.merch.journey.title') }}
    </h2>

    <p ref="introRef" class="journey-intro mt-5 max-w-3xl text-lg font-bold leading-[1.7] text-gray-800 sm:text-xl">
      {{ $t('pages.merch.journey.intro') }}
    </p>

    <!-- Steps: numbered rows with a progress line that draws itself as you scroll -->
    <ol ref="stepsRef" class="journey-steps relative m-0 mt-14 list-none p-0 sm:mt-16">
      <!-- Vertical rail + animated fill -->
      <div class="pointer-events-none absolute left-[1.6rem] top-2 bottom-2 hidden w-px bg-black/10 sm:block" aria-hidden="true">
        <div ref="progressRef" class="journey-progress h-full w-full origin-top scale-y-0 bg-black"></div>
      </div>

      <li
        v-for="(step, index) in journeySteps"
        :key="step.id"
        class="journey-step group relative flex gap-5 py-7 sm:gap-8 sm:py-9"
      >
        <!-- Number badge / node on the rail -->
        <div class="relative z-10 shrink-0">
          <span class="journey-number flex h-[3.2rem] w-[3.2rem] items-center justify-center rounded-full border border-black/15 bg-white text-lg font-extrabold tabular-nums text-black transition-colors duration-500 group-hover:bg-black group-hover:text-white sm:h-11 sm:w-11 sm:text-base">
            {{ String(index + 1).padStart(2, '0') }}
          </span>
        </div>

        <div class="min-w-0 flex-1">
          <h3 class="text-xl font-extrabold uppercase leading-tight tracking-[0.02em] text-black sm:text-2xl lg:text-3xl">
            {{ $t(`pages.merch.journey.steps.${step.id}.title`) }}
          </h3>
          <p class="mt-2 max-w-2xl text-base leading-[1.7] text-gray-700 sm:text-lg">
            {{ $t(`pages.merch.journey.steps.${step.id}.description`) }}
          </p>
        </div>
      </li>
    </ol>
  </section>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { journeySteps } from '~/data/servicesExtras';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import { SplitText } from 'gsap/SplitText';

  gsap.registerPlugin(ScrollTrigger, SplitText);

  const panelRef = useTemplateRef('panelRef');
  const panelVisualRef = useTemplateRef('panelVisualRef');
  const panelInnerRef = useTemplateRef('panelInnerRef');
  const journeyRef = useTemplateRef('journeyRef');
  const titleRef = useTemplateRef('titleRef');
  const introRef = useTemplateRef('introRef');
  const stepsRef = useTemplateRef('stepsRef');
  const progressRef = useTemplateRef('progressRef');

  let titleSplit;
  let animationContext;
  let resizeHandler;
  let resizeTimeout;

  onMounted(async () => {
    await nextTick();
    await document.fonts.ready;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    buildPanelAnimations();

    resizeHandler = () => {
      window.clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => {
        buildPanelAnimations();
      }, 160);
    };

    window.addEventListener('resize', resizeHandler, { passive: true });
  });

  function buildPanelAnimations() {
    // Rebuild measurements after responsive layout changes so the fake-scroll
    // distance, pin duration, and following FAQ position stay in sync.
    titleSplit?.revert();
    animationContext?.revert();
    titleSplit = undefined;

    const panel = panelRef.value;
    const visual = panelVisualRef.value;
    const inner = panelInnerRef.value;
    if (!panel || !visual || !inner) return;

    panel.style.marginBottom = '0px';
    gsap.set(inner, { clearProps: 'transform' });
    gsap.set(visual, { clearProps: 'transform,opacity' });

    animationContext = gsap.context(() => {
      titleSplit = SplitText.create(titleRef.value, {
        type: 'lines, words',
        linesClass: 'journey-title-line',
      });

      const panelHeight = panel.clientHeight || window.innerHeight;
      const contentHeight = Math.max(inner.scrollHeight, inner.offsetHeight);
      const difference = Math.max(0, contentHeight - panelHeight);
      const hasFakeScroll = difference > 0;
      const fakeScrollDuration = hasFakeScroll ? difference / panelHeight : 0;

      // The panel contributes its viewport height plus the fake-scroll distance.
      // That equals the pin duration, so FAQs never catch up before Journey finishes.
      panel.style.marginBottom = `${difference}px`;

      gsap.set(visual, { scale: 1, autoAlpha: 1, transformOrigin: 'center center' });

      // Incoming scale-up: this is the handoff from Services into Project Journey.
      // Animate the visual child, not the element ScrollTrigger will pin.
      gsap.fromTo(
        visual,
        { scale: 0.7, autoAlpha: 0.5 },
        {
          scale: 1,
          autoAlpha: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: panel,
            start: 'top bottom',
            end: 'top top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: 'bottom bottom',
          end: () => `+=${Math.max(inner.scrollHeight, panel.clientHeight)}`,
          pin: panel,
          pinSpacing: false,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // When the content exceeds the viewport, move it upward in sync with scroll.
      if (hasFakeScroll) {
        timeline.to(
          inner,
          {
            y: () => -(Math.max(inner.scrollHeight, inner.offsetHeight) - panel.clientHeight),
            duration: fakeScrollDuration,
            ease: 'none',
          },
          0,
        );

        timeline.to(
          progressRef.value,
          { scaleY: 1, duration: fakeScrollDuration, ease: 'none' },
          0,
        );
      } else {
        // For a short panel, use part of its viewport-long pin to reveal the rail.
        timeline.to(progressRef.value, { scaleY: 1, duration: 0.35, ease: 'none' }, 0);
      }

      const stepElements = gsap.utils.toArray('.journey-step', stepsRef.value);
      const titleDuration = hasFakeScroll
        ? Math.min(0.55, Math.max(0.08, fakeScrollDuration * 0.45))
        : 0.24;
      const stepDuration = hasFakeScroll
        ? Math.min(0.32, Math.max(0.06, fakeScrollDuration / (stepElements.length + 1)))
        : 0.12;
      const maxTitleStart = hasFakeScroll ? Math.max(0, fakeScrollDuration - titleDuration) : 0.12;
      const maxStepStart = hasFakeScroll ? Math.max(0, fakeScrollDuration - stepDuration) : 0.2;

      const contentOffset = (element) => {
        let offset = 0;
        let node = element;

        while (node && node !== inner) {
          offset += node.offsetTop || 0;
          node = node.offsetParent;
        }

        return offset;
      };

      const revealStart = (element, maxStart) => {
        const idealStart = (contentOffset(element) - panelHeight * 0.8) / panelHeight;
        return gsap.utils.clamp(0, maxStart, idealStart);
      };

      // Tie the internal reveals to the same pinned timeline. Independent
      // ScrollTriggers would measure natural document positions, not fake-scroll.
      if (titleSplit?.words?.length) {
        timeline.from(
          titleSplit.words,
          {
            yPercent: 110,
            autoAlpha: 0,
            filter: 'blur(4px)',
            ease: 'power4.out',
            duration: titleDuration,
            stagger: Math.min(0.035, titleDuration / Math.max(titleSplit.words.length, 1)),
          },
          revealStart(titleRef.value, maxTitleStart),
        );
      }

      timeline.from(
        introRef.value,
        {
          y: 24,
          autoAlpha: 0,
          duration: stepDuration,
          ease: 'power3.out',
        },
        revealStart(introRef.value, maxTitleStart),
      );

      stepElements.forEach((step) => {
        timeline.from(
          step,
          {
            y: 32,
            autoAlpha: 0,
            duration: stepDuration,
            ease: 'power3.out',
          },
          revealStart(step, maxStepStart),
        );
      });

      // Exit scale/fade mirrors the supplied CodePen pattern and reveals FAQs below.
      const exitStart = hasFakeScroll ? fakeScrollDuration : 0.35;
      const exitScaleDuration = hasFakeScroll ? 0.9 : 0.58;
      const exitFadeDuration = hasFakeScroll ? 0.1 : 0.07;

      timeline
        .to(
          visual,
          {
            scale: 0.7,
            autoAlpha: 0.5,
            duration: exitScaleDuration,
            ease: 'none',
          },
          exitStart,
        )
        .to(
          visual,
          { autoAlpha: 0, duration: exitFadeDuration, ease: 'none' },
          exitStart + exitScaleDuration,
        );

      ScrollTrigger.refresh();
    }, panel);
  }

  onUnmounted(() => {
    window.removeEventListener('resize', resizeHandler);
    window.clearTimeout(resizeTimeout);
    titleSplit?.revert();
    animationContext?.revert();
    panelRef.value?.style.removeProperty('margin-bottom');
  });
</script>

<style scoped>
  .journey-slide-panel {
    position: relative;
    height: 100svh;
    overflow: hidden;
  }

  .journey-panel-visual {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    transform-origin: center center;
    will-change: transform, opacity;
  }

  .journey-panel-inner {
    position: relative;
    width: 100%;
  }

  /* SplitText inserts these wrappers at runtime, so the selector must cross Vue's scope. */
  :deep(.journey-title-line) {
    overflow: hidden;
    padding-bottom: 0.05em;
    margin-bottom: -0.05em;
  }

  @media (prefers-reduced-motion: reduce) {
    .journey-slide-panel {
      height: auto;
      min-height: 0;
      overflow: visible;
      margin-bottom: 0 !important;
    }

    .journey-panel-visual {
      height: auto;
      overflow: visible;
      transform: none !important;
      opacity: 1 !important;
      will-change: auto;
    }

    .journey-panel-inner {
      transform: none !important;
    }
  }
</style>
