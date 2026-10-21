<template>
  <section ref="sectionBandRef" class="section-band">
    <h1 class="sr-only">{{ $t('pages.band.title') }}</h1>
    <div class="flex flex-col lg:flex-row lg:flex-wrap gap-x-4 bg-black text-white border-t-16 border-t-black">
      <div class="flex-auto min-w-0 max-w-2xl">
        <p ref="introRef" class="p-6 text-pretty text-[clamp(1.05rem,2.4vw,1.35rem)] leading-relaxed max-w-2xl">{{ $t('pages.band.intro') }}</p>
      </div>
      <figure v-for="(image, index) in images" :key="image.src" :class="`figure-${index}`" class="relative flex-auto overflow-hidden">
        <div class="reveal-columns absolute z-90 inset-0 w-full h-full">
          <DynamicColumns :min="5" :max="6" />
        </div>
        <div class="relative">
          <NuxtImg class="max-lg:h-auto h-[50dvh] w-full object-cover transition-all duration-500 ease-in-out cursor-pointer will-change-transform lg:scale-105 hover:scale-110" sizes="400px md:640px xl:1920px" :alt="$t(image.textKey)" :src="`/images/band/${image.src}`" @click="handleClick" @mousemove="handleMouseMove" />
        </div>
        <figcaption class="relative z-10 h-full text-white bg-black">{{ $t(image.textKey) }}</figcaption>
      </figure>
    </div>
    <p class="p-6 text-pretty">&copy; {{ $t('pages.band.copyrightText') }}</p>
  </section>
</template>

<script setup>
  import { images } from "~/data/media";
  import { pageTransitionConfig } from '~/helpers/transitionConfig';

  import gsap from "gsap";
  import { ScrollTrigger } from 'gsap/ScrollTrigger'
  import { SplitText } from "gsap/SplitText";

  gsap.registerPlugin(SplitText, ScrollTrigger);

  definePageMeta({
    pageTransition: pageTransitionConfig,
  });

  const { t } = useI18n();
  const sectionBandRef = useTemplateRef('sectionBandRef');
  const introRef = useTemplateRef('introRef');
  const prevImage = ref(null);
  const currentImage = ref(null);
  let isLargeDevice;
  let ctx;

  useSeoMeta({
    title: `${t('pages.band.meta.title')} | ${t('siteName')}`,
    description: t('pages.band.meta.description'),
    ogTitle: `${t('pages.band.meta.title')} | ${t('siteName')}`,
    ogDescription: t('pages.band.meta.description'),
  })

  const handleClick = (e) => {
    const element = e.srcElement

    prevImage.value = (currentImage.value !== null) ? currentImage.value : element
    currentImage.value = element;

    if (prevImage.value !== currentImage.value) {
      prevImage.value.classList.remove('band-image-expanded')
      prevImage.value.closest('figure')?.classList.remove('band-figure-expanded')
    }

    if (isLargeDevice.matches) {
      element.classList.toggle('hover:scale-110')
      element.classList.toggle('band-image-expanded')
      element.closest('figure')?.classList.toggle('band-figure-expanded')

      if (element.classList.contains('band-image-expanded')) {
        gsap.set(element.parentElement, { x: 0, y: 0 })
      }
    }

    // Keep the expanded image centered after its size transition finishes.
    const isExpanded = isLargeDevice.matches && element.classList.contains('band-image-expanded');
    const delay = isLargeDevice.matches ? 500 : 0;
    setTimeout(function () {
      element.scrollIntoView({
        behavior: "smooth",
        block: isExpanded ? "center" : "start",
        inline: isExpanded ? "center" : "start",
      })
    }, delay);
  }

  const handleMouseMove = (e) => {
    // @todo Make a composable.
    const movement = 15;
    const target = e.currentTarget;

    // Do not let the hover-parallax offset move an expanded image out of center.
    if (target.classList.contains('band-image-expanded')) return;

    const rect = target.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;

    const x = Math.round(((relX - rect.width / 2) / rect.width) * movement);
    const y = Math.round(((relY - rect.height / 2) / rect.height) * movement);

    gsap.to(target.parentElement, {
      duration: .5,
      x: x,
      y: y,
    });
  }

  onMounted(() => {
    isLargeDevice = window.matchMedia("(min-width: 1024px)");

    SplitText.create(introRef.value, {
      type: 'lines, words',
      mask: 'lines',
      linesClass: 'line',
      wordsClass: 'word',
    });

    gsap.set(sectionBandRef.value, { clipPath: 'inset(100% 0% 0% 0%)' });
    gsap.set(introRef.value.querySelectorAll('.word'), { y: 200 });

    ctx = gsap.context(() => {
      gsap
        .timeline({
          paused: true,
        })
        .to(sectionBandRef.value, {
          duration: 1.3,
          clipPath: 'inset(0% 0% 0% 0%)',
          ease: 'power4.out',
        })
        .add(figuresReveal, '>0.5')
        .add(introReveal, '<0.4')
        .play();

      function introReveal() {
        introRef.value.querySelectorAll('.line').forEach((line) => {
          gsap.to(line.querySelectorAll('.word'), {
            y: 0,
            duration: 1.4,
            stagger: 0.05,
            ease: 'power4.inOut',
          });
        });
      }

      function figuresReveal() {
        ScrollTrigger.batch('figure', {
          start: 'top bottom-=9%',
          once: true,
          // markers: true,
          onEnter: (figures) => {
            const rect = figures.map((figure) => {
              return figure.querySelectorAll('rect')
            })

            gsap.to(rect, {
              '--scaleYBandColumnsReveal': '0%',
              stagger: {
                each: 0.035,
                from: "random"
              },
              duration: 1,
              ease: "power4.inOut",
              onStart: () => {
                gsap.set(rect, {
                  '--scaleYBandColumnsReveal': "100%",
                })
                gsap.set('.reveal-columns', {
                  pointerEvents: 'none'
                })
              },
            })
          },
        });
      }
    }, sectionBandRef.value);
  });

  onUnmounted(() => {
    ctx.revert();
  });
</script>

<style>
  :root {
    --scaleYBandColumnsReveal: 100%;
  }

  .reveal-columns rect {
    transform: scaleY(var(--scaleYBandColumnsReveal));
    transform-origin: bottom;
    will-change: auto;
  }

  @media (min-width: 1024px) {
    .section-band figure.band-figure-expanded {
      display: flex;
      flex: 0 0 100%;
      flex-direction: column;
      width: 100%;
    }

    .section-band figure.band-figure-expanded > div.relative {
      display: flex;
      justify-content: center;
      width: 100%;
    }

    .section-band figure img.band-image-expanded {
      width: min(100%, calc(133.333dvh - 1.867rem));
      height: auto;
      aspect-ratio: 4 / 3;
      object-fit: cover;
      transform: none;
    }
  }
</style>
