<!-- <template> -->
<!--   <section class="bg-white px-5 py-16 text-black sm:px-8 sm:py-20 md:px-12 lg:px-14 lg:py-28" aria-labelledby="footer-faq-title"> -->
<!--     <div class="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10 xl:gap-16"> -->
<!--       <div class="order-last flex flex-col justify-between gap-8 lg:order-none lg:col-span-3"> -->
<!--         <div class="flex items-center gap-3 text-sm font-semibold tracking-wide"> -->
<!--           <span class="h-3 w-3 shrink-0 rounded-full bg-black" aria-hidden="true"></span> -->
<!--           <span>{{ $t("footer.faq.eyebrow") }}</span> -->
<!--         </div> -->
<!--         <div class="flex max-w-xs flex-col items-start gap-4"> -->
<!--           <img -->
<!--             src="/images/abel_ortega_huaraca_profile.webp" -->
<!--             :alt="$t('footer.faq.headshotAlt')" -->
<!--             class="size-28 aspect-square object-cover sm:size-32 md:size-36 lg:size-[182px]" -->
<!--             width="96" -->
<!--             height="96" -->
<!--             loading="lazy" -->
<!--             decoding="async" -->
<!--           /> -->
<!--           <p class="max-w-[65%] text-base leading-relaxed text-black/75 sm:text-lg"> -->
<!--             {{ $t("footer.faq.aside") }} -->
<!--           </p> -->
<!--           <button -->
<!--             type="button" -->
<!--             data-cal-namespace="zenIntroCall" -->
<!--             data-cal-link="aberu-ar-pei6iq/intro-call-w-aberu" -->
<!--             data-cal-config='{"layout":"month_view","theme":"light"}' -->
<!--             class="group relative isolate inline-flex min-h-11 items-center gap-5 overflow-hidden border border-black/20 py-1.5 pl-4 pr-1.5 text-left text-xs font-medium text-black transition-colors duration-300 before:absolute before:inset-0 before:z-0 before:origin-left before:scale-x-0 before:bg-black before:transition-transform before:duration-500 before:ease-out hover:border-black hover:text-white hover:before:scale-x-100 focus-visible:border-black focus-visible:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black focus-visible:before:scale-x-100 motion-reduce:transition-none motion-reduce:before:transition-none" -->
<!--           > -->
<!--             <span class="relative z-10 transition-colors duration-300 group-hover:text-white group-focus-visible:text-white">{{ $t("footer.faq.bookCall") }}</span> -->
<!--             <span class="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center bg-black text-white transition-[background-color,color,transform] duration-300 group-hover:scale-105 group-hover:bg-white group-hover:text-black group-focus-visible:bg-white group-focus-visible:text-black motion-reduce:transition-none"> -->
<!--               <svg -->
<!--                 xmlns="http://www.w3.org/2000/svg" -->
<!--                 viewBox="0 0 12 12" -->
<!--                 fill="none" -->
<!--                 class="h-4 w-4" -->
<!--                 aria-hidden="true" -->
<!--               > -->
<!--                 <path d="M8.90954 9.09046L9 3L2.90954 3.09046L2.90213 4.32367L6.86437 4.25391L2.55914 8.55914L3.44086 9.44086L7.74609 5.13563L7.68708 9.10862L8.90954 9.09046Z" fill="currentColor" /> -->
<!--               </svg> -->
<!--             </span> -->
<!--           </button> -->
<!--         </div> -->
<!--       </div> -->
<!---->
<!--       <div class="order-first min-w-0 lg:order-none lg:col-span-9"> -->
<!--         <h2 id="footer-faq-title" class="mb-12 max-w-4xl text-[clamp(2.25rem,5.2vw,5rem)] font-semibold leading-[0.98] tracking-[-0.055em] sm:mb-16 lg:mb-20"> -->
<!--           {{ $t("footer.faq.title") }} -->
<!--         </h2> -->
<!---->
<!--         <div class="border-t border-black/15"> -->
<!--           <article v-for="(item, index) in $tm('footer.faq.questions')" :key="index" class="border-b border-black/15"> -->
<!--             <h3> -->
<!--               <button -->
<!--                 :id="`footer-faq-trigger-${index}`" -->
<!--                 class="group flex w-full items-center justify-between gap-6 py-5 text-left text-base font-medium leading-snug text-black transition-colors duration-300 ease-out hover:text-black/55 focus-visible:text-black/65 motion-reduce:transition-none sm:py-6 sm:text-lg" -->
<!--                 type="button" -->
<!--                 :aria-expanded="openIndex === index" -->
<!--                 :aria-controls="`footer-faq-panel-${index}`" -->
<!--                 @click="toggleQuestion(index)" -->
<!--               > -->
<!--                 <span class="transition-opacity duration-300 ease-out group-hover:opacity-60 group-focus-visible:opacity-70 motion-reduce:transition-none">{{ $rt(item.question) }}</span> -->
<!--                 <span class="relative flex h-5 w-5 shrink-0 items-center justify-center" aria-hidden="true"> -->
<!--                   <span class="absolute h-px w-3.5 bg-current transition-transform duration-300"></span> -->
<!--                   <span class="absolute h-3.5 w-px bg-current transition-transform duration-300" :class="openIndex === index ? 'scale-y-0' : 'scale-y-100'"></span> -->
<!--                 </span> -->
<!--               </button> -->
<!--             </h3> -->
<!--             <Transition -->
<!--               enter-active-class="transition-[grid-template-rows,opacity,transform] duration-300 ease-out motion-reduce:duration-0" -->
<!--               enter-from-class="grid-rows-[0fr] translate-y-[-4px] opacity-0" -->
<!--               enter-to-class="grid-rows-[1fr] translate-y-0 opacity-100" -->
<!--               leave-active-class="transition-[grid-template-rows,opacity,transform] duration-250 ease-in motion-reduce:duration-0" -->
<!--               leave-from-class="grid-rows-[1fr] translate-y-0 opacity-100" -->
<!--               leave-to-class="grid-rows-[0fr] translate-y-[-4px] opacity-0" -->
<!--             > -->
<!--               <div -->
<!--                 v-if="openIndex === index" -->
<!--                 :id="`footer-faq-panel-${index}`" -->
<!--                 role="region" -->
<!--                 :aria-labelledby="`footer-faq-trigger-${index}`" -->
<!--                 class="grid" -->
<!--               > -->
<!--                 <div class="min-h-0 overflow-hidden"> -->
<!--                   <div class="max-w-3xl pb-6 pr-8 text-sm leading-relaxed text-black/65 sm:pb-7 sm:text-base"> -->
<!--                     {{ $rt(item.answer) }} -->
<!--                   </div> -->
<!--                 </div> -->
<!--               </div> -->
<!--             </Transition> -->
<!--           </article> -->
<!--         </div> -->
<!--       </div> -->
<!--     </div> -->
<!--   </section> -->
<!-- </template> -->
<!---->
<!-- <script setup> -->
<!--   const openIndex = ref(-1); -->
<!---->
<!--   const CAL_NAMESPACE = "zenIntroCall"; -->
<!---->
<!--   function initializeCalEmbed() { -->
<!--     if (window.Cal?.ns?.[CAL_NAMESPACE]) return; -->
<!---->
<!--     (function (C, A, L) { -->
<!--       const push = (api, args) => api.q.push(args); -->
<!--       const d = C.document; -->
<!---->
<!--       C.Cal = C.Cal || function () { -->
<!--         const cal = C.Cal; -->
<!--         const args = arguments; -->
<!---->
<!--         if (!cal.loaded) { -->
<!--           cal.ns = {}; -->
<!--           cal.q = cal.q || []; -->
<!--           d.head.appendChild(d.createElement("script")).src = A; -->
<!--           cal.loaded = true; -->
<!--         } -->
<!---->
<!--         if (args[0] === L) { -->
<!--           const api = function () { -->
<!--             push(api, arguments); -->
<!--           }; -->
<!--           const namespace = args[1]; -->
<!--           api.q = api.q || []; -->
<!---->
<!--           if (typeof namespace === "string") { -->
<!--             cal.ns[namespace] = api; -->
<!--             push(api, args); -->
<!--           } else { -->
<!--             push(cal, args); -->
<!--           } -->
<!---->
<!--           return; -->
<!--         } -->
<!---->
<!--         push(cal, args); -->
<!--       }; -->
<!--     })(window, "https://app.cal.com/embed/embed.js", "init"); -->
<!---->
<!--     window.Cal("init", CAL_NAMESPACE, { origin: "https://app.cal.com" }); -->
<!--     window.Cal.ns[CAL_NAMESPACE]("ui", { -->
<!--       styles: { -->
<!--         branding: { -->
<!--           brandColor: "#000000", -->
<!--         }, -->
<!--       }, -->
<!--       hideEventTypeDetails: false, -->
<!--       layout: "month_view", -->
<!--     }); -->
<!--   } -->
<!---->
<!--   onMounted(() => { -->
<!--     initializeCalEmbed(); -->
<!--   }); -->
<!---->
<!--   function toggleQuestion(index) { -->
<!--     openIndex.value = openIndex.value === index ? -1 : index; -->
<!--   } -->
<!-- </script> -->
<!---->
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
