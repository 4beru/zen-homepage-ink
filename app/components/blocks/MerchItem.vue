<template>
  <article
    :id="service.id"
    data-service-block
    class="service-item w-full"
    :aria-labelledby="`service-title-${index}`"
  >
    <div class="grid grid-cols-1 items-center gap-8 sm:gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
      <!-- Imagen principal: mantiene la proporción 4:3 en todos los breakpoints. -->
      <AnimationReveal class="w-full lg:col-span-7 xl:col-span-8">
        <figure class="group relative isolate w-full overflow-hidden rounded-none bg-gray-100">
          <NuxtImg
            :src="service.image"
            :alt="$t(service.altKey)"
            :loading="index === 0 ? 'eager' : 'lazy'"
            class="block aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out motion-reduce:transform-none motion-reduce:transition-none group-hover:scale-[1.015]"
            sizes="100vw md:100vw xl:1920px"
          />
        </figure>
      </AnimationReveal>

      <!-- El título y la descripción acompañan la imagen en la columna derecha. -->
      <div class="flex min-w-0 flex-col justify-center lg:col-span-5 xl:col-span-4">
        <AnimationReveal class="w-full">
          <h2
            :id="`service-title-${index}`"
            class="max-w-2xl text-[clamp(2rem,4vw,3.8rem)] leading-[1.02] tracking-[-0.03em] text-black"
          >
            {{ $t(service.titleKey) }}
          </h2>
        </AnimationReveal>

        <AnimationReveal class="mt-5 w-full sm:mt-6">
          <p class="max-w-xl text-base font-bold leading-[1.75] sm:text-lg lg:text-[1.0625rem] xl:text-lg">
            {{ $t(service.descriptionKey) }}
          </p>
        </AnimationReveal>
      </div>
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
