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
        <figure class="group relative isolate aspect-[4/3] w-full overflow-hidden rounded-none bg-gray-100">
          <NuxtImg
            :src="props.item.image"
            :alt="$t(props.item.altKey)"
            :loading="props.index === 0 ? 'eager' : 'lazy'"
            class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out motion-reduce:transform-none motion-reduce:transition-none group-hover:scale-[1.015]"
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

  const previewVideoRef = useTemplateRef("previewVideoRef");
  const isPreviewPlaying = ref(false);
  let previewRequestId = 0;

  async function playPreview() {
    const video = previewVideoRef.value;

    if (!video || !props.item.video) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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
      }
    }
  }

  function stopPreview() {
    previewRequestId += 1;
    isPreviewPlaying.value = false;

    const video = previewVideoRef.value;
    if (!video) return;

    video.pause();

    // Reset only after metadata is available, so re-entering always starts
    // from the beginning without assigning currentTime in HAVE_NOTHING.
    if (video.readyState > 0) {
      video.currentTime = 0;
    }
  }

  onBeforeUnmount(stopPreview);
</script>
