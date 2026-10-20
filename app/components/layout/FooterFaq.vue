<template>
  <section class="bg-white px-5 py-16 text-black sm:px-8 sm:py-20 md:px-12 lg:px-14 lg:py-28" aria-labelledby="footer-faq-title">
    <div class="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10 xl:gap-16">
      <div class="order-last flex flex-col justify-between gap-8 lg:order-none lg:col-span-3">
        <div class="flex items-center gap-3 text-sm font-semibold tracking-wide">
          <span class="h-3 w-3 shrink-0 rounded-full bg-black" aria-hidden="true"></span>
          <span>{{ $t("footer.faq.eyebrow") }}</span>
        </div>
        <div class="flex max-w-xs flex-col items-start gap-4">
          <img
            src="/images/abel_ortega_huaraca_profile.webp"
            :alt="$t('footer.faq.headshotAlt')"
            class="size-28 aspect-square object-cover sm:size-32 md:size-36 lg:size-[182px]"
            width="96"
            height="96"
            loading="lazy"
            decoding="async"
          />
          <p class="max-w-[75%] text-lg font-medium leading-[1.15] tracking-[-0.02em] text-black sm:text-xl">
            {{ $t("footer.faq.aside") }}
          </p>
          <CalBookingButton
            :label="$t('footer.faq.bookCall')"
            size="xs"
            class="border border-black/15 focus-visible:outline-black"
          />

        </div>
      </div>

      <div class="order-first min-w-0 lg:order-none lg:col-span-9">
        <h2 id="footer-faq-title" class="mb-12 max-w-4xl text-[clamp(2.25rem,5.2vw,5rem)] font-semibold leading-[0.98] tracking-[-0.055em] sm:mb-16 lg:mb-20">
          {{ $t("footer.faq.title") }}
        </h2>

        <div class="border-t border-black/15">
          <article v-for="(item, index) in $tm('footer.faq.questions')" :key="index" class="border-b border-black/15">
            <h3>
              <button
                :id="`footer-faq-trigger-${index}`"
                class="group flex w-full items-center justify-between gap-6 py-5 text-left text-base font-medium leading-snug text-black transition-colors duration-300 ease-out hover:text-black/55 focus-visible:text-black/65 motion-reduce:transition-none sm:py-6 sm:text-lg"
                type="button"
                :aria-expanded="openIndex === index"
                :aria-controls="`footer-faq-panel-${index}`"
                @click="toggleQuestion(index)"
              >
                <span class="transition-opacity duration-300 ease-out group-hover:opacity-60 group-focus-visible:opacity-70 motion-reduce:transition-none">{{ $rt(item.question) }}</span>
                <span class="relative flex h-5 w-5 shrink-0 items-center justify-center" aria-hidden="true">
                  <span class="absolute h-px w-3.5 bg-current transition-transform duration-300"></span>
                  <span class="absolute h-3.5 w-px bg-current transition-transform duration-300" :class="openIndex === index ? 'scale-y-0' : 'scale-y-100'"></span>
                </span>
              </button>
            </h3>
            <Transition
              enter-active-class="transition-[grid-template-rows,opacity,transform] duration-300 ease-out motion-reduce:duration-0"
              enter-from-class="grid-rows-[0fr] translate-y-[-4px] opacity-0"
              enter-to-class="grid-rows-[1fr] translate-y-0 opacity-100"
              leave-active-class="transition-[grid-template-rows,opacity,transform] duration-250 ease-in motion-reduce:duration-0"
              leave-from-class="grid-rows-[1fr] translate-y-0 opacity-100"
              leave-to-class="grid-rows-[0fr] translate-y-[-4px] opacity-0"
            >
              <div
                v-if="openIndex === index"
                :id="`footer-faq-panel-${index}`"
                role="region"
                :aria-labelledby="`footer-faq-trigger-${index}`"
                class="grid"
              >
                <div class="min-h-0 overflow-hidden">
                  <div class="max-w-3xl pb-6 pr-8 text-sm leading-relaxed text-black/65 sm:pb-7 sm:text-base">
                    {{ $rt(item.answer) }}
                  </div>
                </div>
              </div>
            </Transition>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  const openIndex = ref(-1);

  function toggleQuestion(index) {
    openIndex.value = openIndex.value === index ? -1 : index;
  }
</script>
