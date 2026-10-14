<template>
  <article :id="service.id" class="service-item w-full" :aria-labelledby="`service-title-${index}`">

    <AnimationReveal class="w-full">
      <h2
        :id="`service-title-${index}`"
        class="max-w-5xl text-[clamp(2rem,5.5vw,4.6rem)] leading-[0.98]"
      >
        {{ $t(service.titleKey) }}
      </h2>
    </AnimationReveal>

    <AnimationReveal class="w-full">
      <p class="mb-6 mt-4 max-w-3xl text-base font-normal leading-relaxed sm:mb-9 sm:mt-5 sm:text-lg lg:text-xl">
        {{ $t(service.descriptionKey) }}
      </p>
    </AnimationReveal>

    <AnimationReveal class="w-full">
      <figure class="service-media group relative isolate w-full overflow-hidden rounded-xl bg-gray-100">
        <NuxtImg
          :src="service.image"
          :alt="$t(service.altKey)"
          :loading="index === 0 ? 'eager' : 'lazy'"
          class="service-image block aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out motion-reduce:transform-none motion-reduce:transition-none group-hover:scale-[1.015] sm:aspect-[16/10] lg:aspect-[16/9]"
          sizes="100vw md:100vw xl:1920px"
        />
      </figure>
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
