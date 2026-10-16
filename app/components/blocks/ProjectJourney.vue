<template>
  <section
    id="project-journey"
    ref="journeyRef"
    class="relative isolate overflow-hidden bg-[#080808] text-[#f0efe9]"
    aria-labelledby="project-journey-title"
  >
    <div class="container py-16 sm:py-20 lg:py-28 xl:py-32">
      <header class="mb-10 sm:mb-14 lg:mb-16">
        <p
          data-journey-eyebrow
          class="mb-5 text-[0.625rem] font-bold uppercase tracking-[0.2em] text-white/55 sm:mb-7 sm:text-xs"
        >
          {{ $t("pages.merch.journey.eyebrow") }}
        </p>

        <h2
          id="project-journey-title"
          ref="journeyTitleRef"
          class="max-w-full text-[clamp(3.15rem,10.4vw,10.5rem)] font-black uppercase leading-[0.82] tracking-[-0.075em] text-[#f0efe9] [text-wrap:balance] lg:whitespace-nowrap"
        >
          {{ $t("pages.merch.journey.title") }}
        </h2>
      </header>

      <div class="border-t border-white/15">
        <article
          v-for="(step, index) in steps"
          :key="step.id"
          data-journey-step
          class="grid grid-cols-[3.25rem_minmax(0,1fr)] gap-x-4 border-b border-white/15 py-7 sm:grid-cols-[4rem_minmax(0,1fr)] sm:gap-x-6 sm:py-9 lg:grid-cols-[minmax(4.5rem,0.52fr)_minmax(15rem,1.05fr)_minmax(0,2.15fr)] lg:gap-x-7 lg:py-0 xl:grid-cols-[minmax(5rem,0.55fr)_minmax(16rem,1fr)_minmax(0,2.2fr)] xl:gap-x-10"
        >
          <p
            data-journey-copy
            class="pt-1 text-[0.5625rem] font-bold uppercase tracking-[0.12em] text-white/50 sm:text-[0.625rem] lg:pt-8 xl:pt-10"
          >
            {{ $t(step.numberKey) }}
          </p>

          <div class="min-w-0 lg:py-8 xl:py-10">
            <h3
              data-journey-copy
              class="max-w-[22ch] text-xl font-bold leading-[1.12] tracking-[-0.035em] text-[#f0efe9] sm:text-2xl xl:text-[1.65rem]"
            >
              {{ $t(step.titleKey) }}
            </h3>
            <p
              data-journey-copy
              class="mt-3 max-w-[34ch] text-sm font-medium leading-[1.65] text-white/60 sm:mt-4 sm:text-base"
            >
              {{ $t(step.descriptionKey) }}
            </p>
          </div>

          <figure
            data-journey-image
            class="group relative isolate col-span-2 mt-6 aspect-[16/10] overflow-hidden bg-white/[0.04] sm:mt-7 lg:col-span-1 lg:mt-0 lg:aspect-[16/10] xl:aspect-[16/9]"
          >
            <NuxtImg
              :src="step.image"
              :alt="$t(step.altKey)"
              :loading="index === 0 ? 'eager' : 'lazy'"
              class="absolute inset-0 block h-full w-full object-cover transition-transform duration-700 ease-out motion-reduce:transform-none motion-reduce:transition-none group-hover:scale-[1.02]"
              sizes="100vw sm:100vw lg:60vw xl:65vw"
            />
            <span
              aria-hidden="true"
              class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/[0.04] opacity-70"
            />
          </figure>
        </article>
      </div>

      <div
        aria-hidden="true"
        class="mt-6 flex items-center justify-between text-[0.5625rem] font-bold uppercase tracking-[0.16em] text-white/35 sm:mt-8 sm:text-[0.625rem]"
      >
        <span>{{ $t("pages.merch.journey.footerLeft") }}</span>
        <span>{{ $t("pages.merch.journey.footerRight") }}</span>
      </div>
    </div>
  </section>
</template>

<script setup>
  import gsap from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";
  import { SplitText } from "gsap/SplitText";

  gsap.registerPlugin(ScrollTrigger, SplitText);

  const journeyRef = useTemplateRef("journeyRef");
  const journeyTitleRef = useTemplateRef("journeyTitleRef");

  const steps = [
    {
      id: "discover",
      numberKey: "pages.merch.journey.steps.discover.number",
      titleKey: "pages.merch.journey.steps.discover.title",
      descriptionKey: "pages.merch.journey.steps.discover.description",
      image: "/albums/video-rock/rythm-desktop.png",
      altKey: "pages.merch.journey.steps.discover.alt",
    },
    {
      id: "shape",
      numberKey: "pages.merch.journey.steps.shape.number",
      titleKey: "pages.merch.journey.steps.shape.title",
      descriptionKey: "pages.merch.journey.steps.shape.description",
      image: "/albums/one/penti-desktop.png",
      altKey: "pages.merch.journey.steps.shape.alt",
    },
    {
      id: "launch",
      numberKey: "pages.merch.journey.steps.launch.number",
      titleKey: "pages.merch.journey.steps.launch.title",
      descriptionKey: "pages.merch.journey.steps.launch.description",
      image: "/albums/velodrome/unimatic-desktop.jpg",
      altKey: "pages.merch.journey.steps.launch.alt",
    },
  ];

  let ctx;
  let titleSplit;

  onMounted(async () => {
    await nextTick();
    await document.fonts.ready;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    ctx = gsap.context(() => {
      titleSplit = SplitText.create(journeyTitleRef.value, {
        type: "chars",
        charsClass: "journey-title-char",
      });

      gsap.from(titleSplit.chars, {
        yPercent: 115,
        autoAlpha: 0,
        filter: "blur(8px)",
        duration: 0.9,
        stagger: 0.018,
        ease: "power4.out",
        scrollTrigger: {
          trigger: journeyTitleRef.value,
          start: "top 84%",
          once: true,
        },
      });

      const stepElements = gsap.utils.toArray("[data-journey-step]", journeyRef.value);

      stepElements.forEach((step) => {
        const copy = step.querySelectorAll("[data-journey-copy]");
        const image = step.querySelector("[data-journey-image]");

        gsap.from(copy, {
          y: 22,
          autoAlpha: 0,
          filter: "blur(5px)",
          duration: 0.72,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: step,
            start: "top 82%",
            once: true,
          },
        });

        gsap.fromTo(
          image,
          { clipPath: "inset(0 0 100% 0)" },
          {
            clipPath: "inset(0 0 0% 0)",
            duration: 1,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: step,
              start: "top 82%",
              once: true,
            },
          }
        );
      });

      ScrollTrigger.refresh();
    }, journeyRef.value);
  });

  onUnmounted(() => {
    ctx?.revert();
    titleSplit?.revert();
  });
</script>
