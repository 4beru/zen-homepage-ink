<template>
  <section
    id="project-journey"
    ref="journeyRef"
    class="relative isolate overflow-hidden bg-[#000] text-[#fff]"
    aria-labelledby="project-journey-title"
  >
    <div class="container py-16 sm:py-20 lg:py-28 xl:py-32">
      <header class="mb-10 sm:mb-14 lg:mb-16">
        <h2
          id="project-journey-title"
          ref="journeyTitleRef"
          class="max-w-full text-[clamp(3.15rem,10.4vw,10.5rem)] font-black uppercase leading-[0.82] tracking-[-0.075em] [text-wrap:balance] transition-[opacity,transform,filter] duration-800 ease-out motion-reduce:transition-none lg:whitespace-nowrap"
          :class="isTitleRevealed ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-6 opacity-0 blur-[6px]'"
        >
          {{ $t("pages.merch.journey.title") }}
        </h2>
      </header>

      <div class="border-t border-white/15">
        <article
          v-for="step in steps"
          :key="step.id"
          :data-journey-step="step.id"
          class="grid grid-cols-[3.25rem_minmax(0,1fr)] gap-x-4 border-b border-white/15 py-7 sm:grid-cols-[4rem_minmax(0,1fr)] sm:gap-x-6 sm:py-9 lg:grid-cols-[minmax(4.5rem,0.52fr)_minmax(15rem,1.05fr)_minmax(0,2.15fr)] lg:gap-x-7 lg:py-0 xl:grid-cols-[minmax(5rem,0.55fr)_minmax(16rem,1fr)_minmax(0,2.2fr)] xl:gap-x-10"
        >
          <p
            data-journey-copy
            class="pt-1 text-[0.5625rem] font-bold uppercase tracking-[0.12em] text-white/50 transition-[opacity,transform,filter] duration-700 ease-out motion-reduce:transition-none sm:text-[0.625rem] lg:pt-8 xl:pt-10"
            :class="isStepRevealed(step.id) ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-4 opacity-0 blur-[5px]'"
          >
            {{ $t(step.numberKey) }}
          </p>

          <div class="min-w-0 lg:py-8 xl:py-10">
            <h3
              data-journey-copy
              class="max-w-[22ch] text-xl font-bold leading-[1.12] tracking-[-0.035em] text-[#f0efe9] transition-[opacity,transform,filter] duration-700 ease-out motion-reduce:transition-none sm:text-2xl xl:text-[1.65rem]"
              :class="isStepRevealed(step.id) ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-4 opacity-0 blur-[5px]'"
            >
              {{ $t(step.titleKey) }}
            </h3>
            <p
              data-journey-copy
              class="mt-3 max-w-[34ch] text-sm font-medium leading-[1.65] text-white/60 transition-[opacity,transform,filter] duration-700 ease-out motion-reduce:transition-none sm:mt-4 sm:text-base"
              :class="isStepRevealed(step.id) ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-4 opacity-0 blur-[5px]'"
            >
              {{ $t(step.descriptionKey) }}
            </p>
          </div>

          <figure
            data-journey-image
            class="group relative isolate col-span-2 mt-6 aspect-[16/10] overflow-hidden bg-white/[0.04] transition-[clip-path] duration-1000 ease-in-out motion-reduce:transition-none sm:mt-7 lg:col-span-1 lg:mt-0 lg:aspect-[16/10] xl:aspect-[16/9]"
            :class="isStepRevealed(step.id) ? '[clip-path:inset(0_0_0%_0)]' : '[clip-path:inset(0_0_100%_0)]'"
          >
            <video
              data-journey-video
              :src="step.video"
              :poster="step.poster"
              :aria-label="$t(step.altKey)"
              aria-roledescription="video"
              loop
              muted
              playsinline
              preload="none"
              tabindex="-1"
              class="absolute inset-0 block h-full w-full object-cover transition-transform duration-700 ease-out motion-reduce:transform-none motion-reduce:transition-none group-hover:scale-[1.02]"
            />
            <span
              aria-hidden="true"
              class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/[0.04] opacity-70"
            />
          </figure>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
  const journeyRef = useTemplateRef("journeyRef");
  const journeyTitleRef = useTemplateRef("journeyTitleRef");

  const steps = [
    {
      id: "discover",
      numberKey: "pages.merch.journey.steps.discover.number",
      titleKey: "pages.merch.journey.steps.discover.title",
      descriptionKey: "pages.merch.journey.steps.discover.description",
      video: "/videos/pj-step-1.webm",
      poster: "/albums/video-rock/rythm-desktop.png",
      altKey: "pages.merch.journey.steps.discover.alt",
    },
    {
      id: "shape",
      numberKey: "pages.merch.journey.steps.shape.number",
      titleKey: "pages.merch.journey.steps.shape.title",
      descriptionKey: "pages.merch.journey.steps.shape.description",
      video: "/videos/pj-step-2.webm",
      poster: "/albums/one/penti-desktop.png",
      altKey: "pages.merch.journey.steps.shape.alt",
    },
    {
      id: "launch",
      numberKey: "pages.merch.journey.steps.launch.number",
      titleKey: "pages.merch.journey.steps.launch.title",
      descriptionKey: "pages.merch.journey.steps.launch.description",
      video: "/videos/pj-step-3.webm",
      poster: "/albums/velodrome/unimatic-desktop.jpg",
      altKey: "pages.merch.journey.steps.launch.alt",
    },
  ];

  const isTitleRevealed = ref(false);
  const revealedStepIds = ref([]);
  const activeVideos = new Set();

  let isActive = false;
  let revealObserver;
  let videoObserver;
  let motionPreferenceQuery;

  const isStepRevealed = (id) => revealedStepIds.value.includes(id);

  function revealAllContent() {
    isTitleRevealed.value = true;
    revealedStepIds.value = steps.map((step) => step.id);
    revealObserver?.disconnect();
    revealObserver = undefined;
  }

  function videosShouldPause() {
    return !isActive || document.hidden || motionPreferenceQuery?.matches;
  }

  function pauseVideo(video, reset = true) {
    video.pause();

    if (reset && video.readyState > 0) {
      video.currentTime = 0;
    }
  }

  async function playVideo(video) {
    if (videosShouldPause() || !activeVideos.has(video)) return;

    try {
      await video.play();

      // Visibility or motion preferences may change while play() is pending.
      if (videosShouldPause() || !activeVideos.has(video)) {
        pauseVideo(video);
      }
    } catch {
      // Keep the poster visible if playback is unavailable or denied.
    }
  }

  function setupRevealObserver() {
    if (!journeyRef.value || !("IntersectionObserver" in window)) {
      revealAllContent();
      return;
    }

    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          if (entry.target === journeyTitleRef.value) {
            isTitleRevealed.value = true;
          } else {
            const stepId = entry.target.dataset.journeyStep;

            if (stepId && !isStepRevealed(stepId)) {
              revealedStepIds.value = [...revealedStepIds.value, stepId];
            }
          }

          revealObserver?.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.05,
      }
    );

    if (journeyTitleRef.value) revealObserver.observe(journeyTitleRef.value);
    journeyRef.value.querySelectorAll("[data-journey-step]").forEach((step) => {
      revealObserver.observe(step);
    });
  }

  function setupVideoPlayback() {
    if (!journeyRef.value || !("IntersectionObserver" in window)) return;

    videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          const video = target;

          if (isIntersecting) {
            activeVideos.add(video);
            playVideo(video);
          } else {
            activeVideos.delete(video);
            pauseVideo(video);
          }
        });
      },
      {
        rootMargin: "160px 0px",
        threshold: 0.05,
      }
    );

    journeyRef.value.querySelectorAll("[data-journey-video]").forEach((video) => {
      video.muted = true;
      videoObserver.observe(video);
    });
  }

  function handleVisibilityChange() {
    if (document.hidden) {
      journeyRef.value?.querySelectorAll("[data-journey-video]").forEach((video) => {
        video.pause();
      });
      return;
    }

    activeVideos.forEach((video) => playVideo(video));
  }

  function handleMotionPreferenceChange() {
    if (motionPreferenceQuery.matches) {
      revealAllContent();
      journeyRef.value?.querySelectorAll("[data-journey-video]").forEach((video) => {
        pauseVideo(video);
      });
      return;
    }

    if (!document.hidden) {
      activeVideos.forEach((video) => playVideo(video));
    }
  }

  function addMotionPreferenceListener() {
    if (motionPreferenceQuery.addEventListener) {
      motionPreferenceQuery.addEventListener("change", handleMotionPreferenceChange);
    } else {
      motionPreferenceQuery.addListener(handleMotionPreferenceChange);
    }
  }

  function removeMotionPreferenceListener() {
    if (!motionPreferenceQuery) return;

    if (motionPreferenceQuery.removeEventListener) {
      motionPreferenceQuery.removeEventListener("change", handleMotionPreferenceChange);
    } else {
      motionPreferenceQuery.removeListener(handleMotionPreferenceChange);
    }
  }

  onMounted(() => {
    isActive = true;
    motionPreferenceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (motionPreferenceQuery.matches) {
      revealAllContent();
    } else {
      setupRevealObserver();
    }

    setupVideoPlayback();
    addMotionPreferenceListener();
    document.addEventListener("visibilitychange", handleVisibilityChange);
  });

  onBeforeUnmount(() => {
    isActive = false;
    revealObserver?.disconnect();
    videoObserver?.disconnect();
    removeMotionPreferenceListener();
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    journeyRef.value?.querySelectorAll("[data-journey-video]").forEach((video) => {
      pauseVideo(video);
    });
    activeVideos.clear();
  });
</script>
