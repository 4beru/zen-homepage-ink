<template>
  <section
    class="bg-white px-5 py-16 text-black sm:px-8 sm:py-20 md:px-12 lg:px-14 lg:py-28"
    aria-labelledby="footer-faq-title"
  >
    <div
      class="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-y-10 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-10 xl:gap-x-16"
    >
      <!-- 1. Eyebrow (Izquierda arriba en desktop, primero en mobile) -->
      <div class="lg:col-span-3 lg:row-start-1">
        <div class="flex items-center gap-3 text-sm font-semibold tracking-wide lg:pt-3">
          <span class="size-2.5 shrink-0 rounded-full bg-black" aria-hidden="true"></span>
          <span>{{ $t("footer.faq.eyebrow") }}</span>
        </div>
      </div>

      <!-- 2. Main FAQ (Título + Acordeón) -->
      <div class="min-w-0 lg:col-span-9 lg:col-start-4 lg:row-span-2 lg:row-start-1">
        <h2
          id="footer-faq-title"
          class="mb-10 max-w-4xl text-[clamp(2.25rem,5.2vw,5rem)] font-semibold leading-[0.98] tracking-[-0.055em] sm:mb-14 lg:mb-20"
        >
          {{ $t("footer.faq.title") }}
        </h2>

        <!-- Lista de FAQs -->
        <div role="list" class="border-t border-black/15">
          <article
            v-for="(item, index) in $tm('footer.faq.questions')"
            :key="index"
            role="listitem"
            :data-accordion-status="openIndex === index ? 'active' : 'not-active'"
            class="border-b border-black/15"
          >
            <h3>
              <!-- .accordion_css_item_top -->
              <button
                :id="`footer-faq-trigger-${index}`"
                type="button"
                class="group relative isolate flex w-full items-center justify-between gap-6 overflow-hidden px-4 py-5 text-left text-base font-medium leading-snug transition-colors ease-out focus-visible:outline-none motion-reduce:transition-none sm:px-6 sm:py-6 sm:text-lg"
                :class="
                  openIndex === index
                    ? 'text-white duration-150'
                    : 'text-black duration-300 hover:text-white hover:duration-150 focus-visible:text-white focus-visible:duration-150'
                "
                :aria-expanded="openIndex === index"
                :aria-controls="`footer-faq-panel-${index}`"
                @click="toggleQuestion(index)"
              >
                <!-- .accordion_css_item_bg -->
                <span
                  aria-hidden="true"
                  class="pointer-events-none absolute inset-0 -z-10 bg-black transition-opacity ease-out motion-reduce:transition-none"
                  :class="
                    openIndex === index
                      ? 'opacity-100 duration-150'
                      : 'opacity-0 duration-500 group-hover:opacity-100 group-hover:duration-150 group-focus-visible:opacity-100 group-focus-visible:duration-150'
                  "
                ></span>

                <!-- .accordion_css_item_heading -->
                <span
                  class="relative z-10 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1 motion-reduce:transition-none"
                  :class="openIndex === index ? 'translate-x-1' : ''"
                >
                  {{ $rt(item.question) }}
                </span>

                <!-- Indicador derecho (+ / -) -->
                <span
                  class="relative z-10 flex size-5 shrink-0 items-center justify-center"
                  aria-hidden="true"
                >
                  <span
                    class="absolute h-[1.5px] w-3.5 bg-current transition-transform duration-500 ease-[cubic-bezier(0.625,0.05,0,1)]"
                  ></span>
                  <span
                    class="absolute h-3.5 w-[1.5px] bg-current transition-transform duration-500 ease-[cubic-bezier(0.625,0.05,0,1)]"
                    :class="openIndex === index ? 'rotate-90 scale-y-0' : 'rotate-0 scale-y-100'"
                  ></span>
                </span>
              </button>
            </h3>

            <!-- 1) .accordion_css_item_bottom (Único elemento que se anima: 0fr <-> 1fr) -->
            <div
              :id="`footer-faq-panel-${index}`"
              role="region"
              :aria-labelledby="`footer-faq-trigger-${index}`"
              :inert="openIndex !== index"
              class="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.625,0.05,0,1)] motion-reduce:transition-none"
              :class="openIndex === index ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
            >
              <!-- 2) .accordion_css_bottom_wrap (Recorta el contenido sin moverlo) -->
              <div class="min-h-0 overflow-hidden">
                <!-- 3) .accordion_css_bottom_contain (100% estático) -->
                <div
                  class="max-w-3xl px-4 pt-5 pb-7 text-sm leading-relaxed text-black/75 sm:px-6 sm:pt-6 sm:pb-8 sm:text-base"
                >
                  {{ $rt(item.answer) }}
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>

      <!-- 3. Aside Card (Foto + CTA) -->
      <div class="mt-4 flex flex-col justify-end lg:col-span-3 lg:row-start-2 lg:mt-0">
        <div class="flex flex-col items-start gap-4">
          <img
            :src="imageUrl('abel_ortega_huaraca_profile.webp', '/images/abel_ortega_huaraca_profile.webp')"
            :alt="$t('footer.faq.headshotAlt')"
            class="size-28 aspect-square object-cover sm:size-32 md:size-36 lg:size-[182px]"
            width="182"
            height="182"
            loading="lazy"
            decoding="async"
          />
          <p
            class="max-w-[20ch] text-lg font-medium leading-[1.15] tracking-[-0.02em] text-black sm:text-xl"
          >
            {{ $t("footer.faq.aside") }}
          </p>
          <CalBookingButton
            :label="$t('footer.faq.bookCall')"
            size="xs"
            class="mt-1 border border-black/15 focus-visible:outline-black"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
  const { imageUrl } = useMediaUrls();

  const openIndex = ref(-1);

  function toggleQuestion(index) {
    openIndex.value = openIndex.value === index ? -1 : index;
  }
</script>
