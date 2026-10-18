<template>
  <article
    data-service-item
    :data-service-index="serviceIndex"
    class="service-item w-full"
    :aria-labelledby="`service-title-${item.id}`"
  >
    <div class="grid grid-cols-1 items-center gap-5 sm:gap-6 lg:grid-cols-12 lg:gap-y-8 lg:gap-x-6 xl:gap-x-7 2xl:gap-x-8">
      <AnimationReveal class="w-full lg:col-span-7 xl:col-span-8">
        <figure class="group relative isolate aspect-[4/3] w-full overflow-hidden rounded-none bg-gray-100">
          <NuxtImg
            :src="item.image"
            :alt="$t(item.altKey)"
            :loading="index === 0 ? 'eager' : 'lazy'"
            class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out motion-reduce:transform-none motion-reduce:transition-none group-hover:scale-[1.015]"
            sizes="100vw md:100vw xl:1920px"
          />
        </figure>
      </AnimationReveal>

      <div class="flex min-w-0 flex-col justify-center lg:col-span-5 xl:col-span-4">
        <AnimationReveal class="w-full">
          <h3
            :id="`service-title-${item.id}`"
            class="max-w-[15ch] text-[clamp(1.7rem,2.55vw,3rem)] leading-[1.04] tracking-[-0.035em] text-black"
          >
            {{ $t(item.titleKey) }}
          </h3>
        </AnimationReveal>

        <AnimationReveal class="mt-3 w-full sm:mt-4">
          <p class="max-w-prose text-base font-bold leading-[1.7] sm:text-lg lg:text-[1.0625rem] xl:text-lg">
            {{ $t(item.descriptionKey) }}
          </p>
        </AnimationReveal>
      </div>
    </div>
  </article>
</template>

<script setup>
  defineProps({
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
</script>
