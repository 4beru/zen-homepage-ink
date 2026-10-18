<template>
  <article
    data-service-item
    :data-service-index="props.serviceIndex"
    class="service-item w-full"
    :aria-labelledby="`service-title-${props.item.id}`"
    @mouseenter="playPreview"
    @mouseleave="stopPreview"
  >
    <div class="grid grid-cols-1 items-center gap-5 sm:gap-6 lg:grid-cols-12 lg:gap-y-8 lg:gap-x-6 xl:gap-x-7 2xl:gap-x-8">
      <AnimationReveal class="w-full lg:col-span-7 xl:col-span-8">
        <figure class="relative isolate aspect-[4/3] w-full overflow-hidden rounded-none bg-gray-100">
          <NuxtImg
            :src="props.item.image"
            :alt="$t(props.item.altKey)"
            :loading="props.index === 0 ? 'eager' : 'lazy'"
            class="absolute inset-0 h-full w-full object-cover"
            sizes="100vw md:100vw xl:1920px"
          />
          <video
            ref="previewVideoRef"
            :src="props.item.video"
            aria-hidden="true"
            tabindex="-1"
            muted
            loop
            playsinline
            preload="none"
            class="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300 ease-out motion-reduce:transition-none"
            :class="{ 'opacity-100': isPreviewPlaying }"
            @transitionend="handlePreviewTransitionEnd"
          />
        </figure>
      </AnimationReveal>

      <div class="flex min-w-0 flex-col justify-center lg:col-span-5 xl:col-span-4">
        <AnimationReveal class="w-full">
          <h3
            :id="`service-title-${props.item.id}`"
            class="max-w-[15ch] text-[clamp(1.7rem,2.55vw,3rem)] leading-[1.04] tracking-[-0.035em] text-black"
          >
            {{ $t(props.item.titleKey) }}
          </h3>
        </AnimationReveal>

        <AnimationReveal class="mt-3 w-full sm:mt-4">
          <p class="max-w-prose text-base font-bold leading-[1.7] sm:text-lg lg:text-[1.0625rem] xl:text-lg">
            {{ $t(props.item.descriptionKey) }}
          </p>
        </AnimationReveal>
      </div>
    </div>
  </article>
</template>

<script setup>
  const props = defineProps({
    item: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    serviceIndex: {
      type: Number,
      required: true,
    },
  });

  const PREVIEW_FADE_DURATION_MS = 300;
  const PREVIEW_PAUSE_FALLBACK_MS = PREVIEW_FADE_DURATION_MS + 100;

  const previewVideoRef = useTemplateRef("previewVideoRef");
  const isPreviewPlaying = ref(false);
  let previewRequestId = 0;
  let previewPauseTimeoutId;
  let isPreviewRequested = false;

  function clearPreviewPauseTimeout() {
    if (previewPauseTimeoutId === undefined) return;

    window.clearTimeout(previewPauseTimeoutId);
    previewPauseTimeoutId = undefined;
  }

  function pauseAndResetPreview() {
    clearPreviewPauseTimeout();

    const video = previewVideoRef.value;
    if (!video || isPreviewPlaying.value) return;

    video.pause();

    // Reset after the fade so the video remains visible while it fades out.
    if (video.readyState > 0) {
      video.currentTime = 0;
    }
  }

  async function playPreview() {
    const video = previewVideoRef.value;

    if (!video || !props.item.video) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Track hover intent separately so a pending play() can reverse the fade.
    isPreviewRequested = true;
    clearPreviewPauseTimeout();
    const requestId = ++previewRequestId;

    try {
      await video.play();

      if (requestId === previewRequestId) {
        isPreviewPlaying.value = true;
      }
    } catch {
      // Autoplay can be denied by the browser; keep the still image visible.
      if (requestId === previewRequestId) {
        isPreviewPlaying.value = false;
        pauseAndResetPreview();
      }
    }
  }

  function handlePreviewTransitionEnd(event) {
    if (event.propertyName !== "opacity") return;
    if (isPreviewPlaying.value || isPreviewRequested) return;

    pauseAndResetPreview();
  }

  function stopPreview() {
    previewRequestId += 1;
    isPreviewRequested = false;

    const wasVisible = isPreviewPlaying.value;
    isPreviewPlaying.value = false;

    const video = previewVideoRef.value;
    if (!video) return;

    clearPreviewPauseTimeout();

    // If the video never became visible, there is no fade to wait for.
    if (!wasVisible) {
      video.pause();

      if (video.readyState > 0) {
        video.currentTime = 0;
      }

      return;
    }

    // transitionend normally pauses it; this timeout is a safety net in case
    // the browser skips the transition event.
    previewPauseTimeoutId = window.setTimeout(() => {
      pauseAndResetPreview();
    }, PREVIEW_PAUSE_FALLBACK_MS);
  }

  function disposePreview() {
    previewRequestId += 1;
    isPreviewRequested = false;
    isPreviewPlaying.value = false;
    clearPreviewPauseTimeout();

    const video = previewVideoRef.value;
    if (!video) return;

    video.pause();

    if (video.readyState > 0) {
      video.currentTime = 0;
    }
  }

  onBeforeUnmount(disposePreview);
</script>
