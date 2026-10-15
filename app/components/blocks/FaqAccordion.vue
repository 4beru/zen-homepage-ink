<template>
  <section ref="faqsRef" class="faqs w-full border-t border-black/10 pt-24 pb-24 sm:pt-28 md:pt-36" aria-labelledby="faqs-title">
    <p class="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-gray-700 sm:text-sm">
      {{ $t('pages.merch.faqs.eyebrow') }}
    </p>

    <h2 id="faqs-title" class="faqs-title max-w-4xl text-[clamp(2.4rem,7vw,4.6rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.01em] text-black">
      {{ $t('pages.merch.faqs.title') }}
    </h2>

    <!-- Giant rotating question mark behind the list (decorative) -->
    <div class="relative mt-14 sm:mt-16">
      <svg
        class="faqs-glyph pointer-events-none absolute -top-10 right-0 hidden h-64 w-64 text-black/[0.05] lg:block"
        viewBox="0 0 100 100"
        aria-hidden="true"
      >
        <text x="50" y="72" text-anchor="middle" font-size="90" font-weight="800" fill="currentColor">?</text>
      </svg>

      <ul class="m-0 list-none p-0">
        <li
          v-for="(faq, index) in faqs"
          :key="faq.id"
          class="faq-item border-b border-black/10 first:border-t"
        >
          <button
            type="button"
            class="faq-trigger group flex w-full items-center justify-between gap-6 py-6 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:py-7"
            :aria-expanded="openIndex === index ? 'true' : 'false'"
            :aria-controls="`faq-panel-${faq.id}`"
            @click="toggle(index)"
          >
            <span class="flex min-w-0 items-baseline gap-4 sm:gap-6">
              <span class="shrink-0 text-xs font-extrabold tabular-nums tracking-[0.12em] text-gray-500 sm:text-sm">
                {{ String(index + 1).padStart(2, '0') }}
              </span>
              <span class="truncate text-lg font-extrabold uppercase leading-tight tracking-[0.02em] text-black transition-transform duration-300 group-hover:translate-x-1 sm:text-xl lg:text-2xl">
                {{ $t(`pages.merch.faqs.items.${faq.id}.question`) }}
              </span>
            </span>

            <!-- Plus / minus icon that rotates on toggle -->
            <span class="faq-icon relative flex h-8 w-8 shrink-0 items-center justify-center" aria-hidden="true">
              <span class="absolute h-px w-5 bg-black"></span>
              <span class="icon-vertical absolute h-5 w-px bg-black"></span>
            </span>
          </button>

          <div :id="`faq-panel-${faq.id}`" class="faq-panel overflow-hidden" role="region">
            <p class="max-w-3xl pb-7 pl-[2.6rem] pr-10 text-base leading-[1.7] text-gray-700 sm:pl-[3.4rem] sm:text-lg">
              {{ $t(`pages.merch.faqs.items.${faq.id}.answer`) }}
            </p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
  import { faqs } from '~/data/servicesExtras';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';

  gsap.registerPlugin(ScrollTrigger);

  const faqsRef = useTemplateRef('faqsRef');
  const openIndex = ref(-1);
  let ctx;

  onMounted(async () => {
    await document.fonts.ready;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Panels start collapsed regardless of JS state.
    gsap.set('.faq-panel', { height: 0 });

    if (reducedMotion) return;

    ctx = gsap.context(() => {
      // Items enter with a staggered slide-up.
      gsap.from('.faq-item', {
        y: 30,
        autoAlpha: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.06,
        scrollTrigger: {
          trigger: '.faq-item',
          start: 'top 88%',
          once: true,
        },
      });

      // The decorative "?" slowly follows the scroll for depth.
      gsap.to('.faqs-glyph', {
        yPercent: -30,
        rotate: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: faqsRef.value,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      });
    }, faqsRef.value);
  });

  onUnmounted(() => {
    ctx?.revert();
  });

  function toggle(index) {
    const vertical = iconVerticalByIndex(index);
    const isOpening = openIndex.value !== index;
    const instant = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Close the previously open item, then open (or keep closed) the clicked one.
    if (openIndex.value >= 0 && openIndex.value !== index) {
      collapse(openIndex.value, instant);
    }

    openIndex.value = isOpening ? index : -1;

    if (isOpening) {
      expand(index, instant);
    } else {
      collapse(index, instant);
    }

    // Rotate the plus into a minus (and back).
    if (vertical) {
      gsap.to(vertical, {
        scaleY: isOpening ? 0 : 1,
        rotation: isOpening ? 90 : 0,
        duration: instant ? 0 : 0.35,
        ease: 'power2.inOut',
      });
    }

    // Keep ScrollTriggers aligned after height changes.
    ScrollTrigger.refresh();
  }

  function expand(index, instant) {
    const panel = panelByIndex(index);
    if (!panel) return;
    gsap.to(panel, {
      height: 'auto',
      duration: instant ? 0 : 0.45,
      ease: 'power3.inOut',
      overwrite: 'auto',
    });
  }

  function collapse(index, instant) {
    const panel = panelByIndex(index);
    if (!panel) return;
    gsap.to(panel, {
      height: 0,
      duration: instant ? 0 : 0.4,
      ease: 'power3.inOut',
      overwrite: 'auto',
    });
    const vertical = glyphIconVertical(index);
    if (vertical) gsap.to(vertical, { scaleY: 1, rotation: 0, duration: instant ? 0 : 0.35, ease: 'power2.inOut' });
  }

  function panelByIndex(index) {
    return document.getElementById(`faq-panel-${faqs[index]?.id}`);
  }

  function iconVerticalByIndex(index) {
    return faqsRef.value?.querySelectorAll('.faq-item')[index]?.querySelector('.icon-vertical');
  }
</script>
