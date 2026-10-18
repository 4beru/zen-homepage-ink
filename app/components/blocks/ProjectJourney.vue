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
          class="max-w-full text-[clamp(3.15rem,10.4vw,10.5rem)] font-black uppercase leading-[0.82] tracking-[-0.075em] [text-wrap:balance] lg:whitespace-nowrap"
        >
          {{ $t("pages.merch.journey.title") }}
        </h2>
      </header>

      <div class="border-t border-white/15">
        <article
          v-for="step in steps"
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
  import gsap from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";

  gsap.registerPlugin(ScrollTrigger);

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

  let isActive = false;
  let animationContext;
  let videoObserver;
  let motionPreferenceQuery;
  const activeVideos = new Set();

  const videosShouldPause = () =>
    !isActive || document.hidden || motionPreferenceQuery?.matches;

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

      // The observer or motion preference may change while play() is pending.
      if (videosShouldPause() || !activeVideos.has(video)) {
        pauseVideo(video);
      }
    } catch {
      // Keep the poster visible if playback is unavailable or denied.
    }
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
      journeyRef.value?.querySelectorAll("[data-journey-video]").forEach((video) => {
        pauseVideo(video);
      });
      return;
    }

    if (!document.hidden) {
      activeVideos.forEach((video) => playVideo(video));
    }
  }

  function setupVideoPlayback() {
    if (!journeyRef.value || !("IntersectionObserver" in window)) return;

    motionPreferenceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
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

    motionPreferenceQuery.addEventListener("change", handleMotionPreferenceChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);
  }

  async function setupAnimations() {
    await nextTick();
    await document.fonts.ready;

    // Footer/layout transitions can unmount this component while fonts load.
    if (!isActive || !journeyRef.value?.isConnected || !journeyTitleRef.value) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    animationContext = gsap.context(() => {
      gsap.from(journeyTitleRef.value, {
        y: 26,
        autoAlpha: 0,
        filter: "blur(6px)",
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: {
          trigger: journeyTitleRef.value,
          start: "top 84%",
          once: true,
        },
      });

      journeyRef.value.querySelectorAll("[data-journey-step]").forEach((step) => {
        const copy = step.querySelectorAll("[data-journey-copy]");
        const image = step.querySelector("[data-journey-image");

        gsap.timeline({
          scrollTrigger: {
            trigger: step,
            start: "top 82%",
            once: true,
          },
        })
          .from(copy, {
            y: 22,
            autoAlpha: 0,
            filter: "blur(5px)",
            duration: 0.65,
            stagger: 0.08,
            ease: "power3.out",
          })
          .from(
            image,
            {
              clipPath: "inset(0 0 100% 0)",
              duration: 0.9,
              ease: "power3.inOut",
            },
            "<0.05"
          );
      });
    }, journeyRef.value);
  }

  onMounted(() => {
    isActive = true;
    setupVideoPlayback();
    void setupAnimations();
  });

  onBeforeUnmount(() => {
    isActive = false;
    videoObserver?.disconnect();
    motionPreferenceQuery?.removeEventListener("change", handleMotionPreferenceChange);
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    activeVideos.forEach((video) => pauseVideo(video));
    activeVideos.clear();
    animationContext?.revert();
    animationContext = undefined;
  });
</script>
