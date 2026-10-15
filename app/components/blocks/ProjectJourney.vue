<template>
  <section ref="journeyRef" class="project-journey w-full border-t border-black/10 pt-24 pb-8 sm:pt-28 md:pt-36" aria-labelledby="journey-title">
    <!-- Eyebrow -->
    <p class="journey-eyebrow mb-4 text-xs font-bold uppercase tracking-[0.18em] text-gray-700 sm:text-sm">
      {{ $t('pages.merch.journey.eyebrow') }}
    </p>

    <!-- Giant headline with a word-by-word GSAP scroll reveal (same spirit as the home blocks).
         Words slide up from behind a line mask via SplitText lines wrapper. -->
    <h2 id="journey-title" class="journey-title max-w-5xl text-[clamp(2.4rem,7vw,4.6rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.01em] text-black">
      {{ $t('pages.merch.journey.title') }}
    </h2>

    <AnimationReveal class="w-full mt-5">
      <p class="max-w-3xl text-lg font-bold leading-[1.7] text-gray-800 sm:text-xl">
        {{ $t('pages.merch.journey.intro') }}
      </p>
    </AnimationReveal>

    <!-- Steps: numbered rows with a progress line that draws itself as you scroll -->
    <ol class="journey-steps relative m-0 mt-14 list-none p-0 sm:mt-16">
      <!-- Vertical rail + animated fill -->
      <div class="pointer-events-none absolute left-[1.6rem] top-2 bottom-2 hidden w-px bg-black/10 sm:block" aria-hidden="true">
        <div class="journey-progress h-full w-full origin-top scale-y-0 bg-black"></div>
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
</template>

<script setup>
  import { journeySteps } from '~/data/servicesExtras';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  import { SplitText } from 'gsap/SplitText';

  gsap.registerPlugin(ScrollTrigger, SplitText);

  const journeyRef = useTemplateRef('journeyRef');
  let titleSplit;
  let ctx;

  onMounted(async () => {
    await document.fonts.ready;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    ctx = gsap.context(() => {
      if (reducedMotion) return;

      // Word-by-word reveal for the giant title, echoing the home timeline style.
      titleSplit = SplitText.create('.journey-title', {
        type: 'lines, words',
        linesClass: 'journey-title-line',
      });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: '.journey-title',
            start: 'top 85%',
            once: true,
          },
        })
        .from(titleSplit.words, {
          yPercent: 110,
          autoAlpha: 0,
          filter: 'blur(4px)',
          ease: 'power4.out',
          duration: 0.9,
          stagger: 0.05,
        });

      // Each step slides/fades in as it enters the viewport.
      gsap.from('.journey-step', {
        y: 40,
        autoAlpha: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: '.journey-steps',
          start: 'top 80%',
          once: true,
        },
      });

      // The rail fills progressively while the steps section scrolls past.
      gsap.to('.journey-progress', {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.journey-steps',
          start: 'top 70%',
          end: 'bottom 60%',
          scrub: 1,
        },
      });
    }, journeyRef.value);
  });

  onUnmounted(() => {
    titleSplit?.revert();
    ctx?.revert();
  });
</script>

<style scoped>
  /* Line mask so the SplitText words slide up from behind the edge, like the home blocks. */
  .journey-title-line {
    overflow: hidden;
    padding-bottom: 0.05em;
    margin-bottom: -0.05em;
  }
</style>
