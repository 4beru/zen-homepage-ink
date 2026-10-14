<template>
  <article class="service-item w-full" :aria-labelledby="`service-title-${index}`">
    <div class="flex items-center justify-between gap-4 border-t border-black/20 pb-4 pt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500 sm:text-xs">
      <span>{{ String(index + 1).padStart(2, "0") }}</span>
      <span>{{ $t("pages.merch.serviceLabel") }}</span>
    </div>

    <AnimationReveal class="w-full">
      <figure class="service-media group relative isolate w-full overflow-hidden bg-gray-100">
        <NuxtImg
          :src="service.image"
          :alt="$t(service.altKey)"
          class="service-image block aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out motion-reduce:transform-none motion-reduce:transition-none sm:aspect-[16/10] lg:aspect-[16/9] group-hover:scale-[1.015]"
          sizes="100vw md:100vw xl:1920px"
        />
      </figure>
    </AnimationReveal>

    <AnimationReveal class="w-full">
      <div class="service-copy flex flex-col items-start gap-3 pt-5 sm:gap-4 sm:pt-7">
        <h2 :id="`service-title-${index}`" class="max-w-5xl text-[clamp(2rem,5.5vw,4.6rem)] leading-[0.98]">
          {{ $t(service.titleKey) }}
        </h2>
        <p class="max-w-3xl text-base font-normal leading-relaxed text-gray-700 sm:text-lg lg:text-xl">
          {{ $t(service.descriptionKey) }}
        </p>
      </div>
    </AnimationReveal>
  </article>
</template>

<script setup>
  defineProps({
    service: {
      type: Object,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  });
</script>
