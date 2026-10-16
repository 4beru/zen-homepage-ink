<template>
  <section class="bg-white px-5 py-16 text-black sm:px-8 sm:py-20 md:px-12 lg:px-14 lg:py-28" aria-labelledby="footer-faq-title">
    <div class="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10 xl:gap-16">
      <div class="flex flex-col justify-between gap-8 lg:col-span-3">
        <div class="flex items-center gap-3 text-sm font-semibold tracking-wide">
          <span class="h-3 w-3 shrink-0 rounded-full bg-black" aria-hidden="true"></span>
          <span>{{ $t("footer.faq.eyebrow") }}</span>
        </div>
        <p class="max-w-xs text-sm leading-relaxed text-black/60">
          {{ $t("footer.faq.questions").length }} {{ $t("footer.faq.eyebrow") }}
        </p>
      </div>

      <div class="min-w-0 lg:col-span-9">
        <h2 id="footer-faq-title" class="mb-12 max-w-4xl text-[clamp(2.25rem,5.2vw,5rem)] font-semibold leading-[0.98] tracking-[-0.055em] sm:mb-16 lg:mb-20">
          {{ $t("footer.faq.title") }}
        </h2>

        <div class="border-t border-black/15">
          <article v-for="(item, index) in $tm('footer.faq.questions')" :key="index" class="border-b border-black/15">
            <h3>
              <button
                :id="`footer-faq-trigger-${index}`"
                class="group flex w-full items-center justify-between gap-6 py-5 text-left text-base font-medium leading-snug sm:py-6 sm:text-lg"
                type="button"
                :aria-expanded="openIndex === index"
                :aria-controls="`footer-faq-panel-${index}`"
                @click="toggleQuestion(index)"
              >
                <span>{{ $rt(item.question) }}</span>
                <span class="relative flex h-5 w-5 shrink-0 items-center justify-center" aria-hidden="true">
                  <span class="absolute h-px w-3.5 bg-current transition-transform duration-300"></span>
                  <span class="absolute h-3.5 w-px bg-current transition-transform duration-300" :class="openIndex === index ? 'scale-y-0' : 'scale-y-100'"></span>
                </span>
              </button>
            </h3>
            <div
              v-if="openIndex === index"
              :id="`footer-faq-panel-${index}`"
              role="region"
              :aria-labelledby="`footer-faq-trigger-${index}`"
              class="max-w-3xl pb-6 pr-8 text-sm leading-relaxed text-black/65 sm:pb-7 sm:text-base"
            >
              {{ $rt(item.answer) }}
            </div>
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
