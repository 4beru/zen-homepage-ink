<template>
  <article :id="service.id" class="service-item w-full" :aria-labelledby="`service-title-${index}`">
    <AnimationReveal class="w-full">
      <h2
        :id="`service-title-${index}`"
        data-service-focus="text"
        class="max-w-5xl text-[clamp(3rem,10vw,4.6rem)] leading-none text-black"
      >
        {{ $t(service.titleKey) }}
      </h2>
    </AnimationReveal>

    <AnimationReveal class="w-full">
      <p
        data-service-focus="text"
        class="mt-3 max-w-3xl text-lg font-normal leading-relaxed text-gray-800 sm:mt-4 lg:text-xl"
      >
        {{ $t(service.descriptionKey) }}
      </p>
    </AnimationReveal>

    <div class="mt-8 flex flex-col gap-8 sm:mt-10 sm:gap-10 lg:mt-12 lg:gap-12">
      <AnimationReveal class="w-full">
        <figure
          data-service-focus="visual"
          class="group relative isolate w-full overflow-hidden rounded-xl bg-gray-100"
        >
          <NuxtImg
            :src="service.image"
            :alt="$t(service.altKey)"
            :loading="index === 0 ? 'eager' : 'lazy'"
            class="block aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out motion-reduce:transform-none motion-reduce:transition-none group-hover:scale-[1.015] sm:aspect-[16/10] lg:aspect-[16/9]"
            sizes="100vw md:100vw xl:1920px"
          />
        </figure>
      </AnimationReveal>

      <AnimationReveal class="w-full">
        <figure
          data-service-focus="visual"
          class="group relative isolate w-full overflow-hidden rounded-xl bg-gray-100"
        >
          <NuxtImg
            :src="service.secondaryImage"
            :alt="$t(service.secondaryAltKey)"
            loading="lazy"
            class="block aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out motion-reduce:transform-none motion-reduce:transition-none group-hover:scale-[1.015] sm:aspect-[16/10] lg:aspect-[16/9]"
            sizes="100vw md:100vw xl:1920px"
          />
        </figure>
      </AnimationReveal>
    </div>
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
