<template>
  <div ref="outerWrapperRef" class="outer-wrapper relative w-fit">
    <div class="anim-reveal-columns absolute z-90 inset-0 w-full h-full">
      <DynamicColumns :min="5" :max="7" />
    </div>
    <div ref="innerWrapperRef" class="inner-wrapper">
      <slot />
    </div>
  </div>
</template>

<script setup>
  import gsap from 'gsap';
  import { ScrollTrigger } from "gsap/ScrollTrigger";

  gsap.registerPlugin(ScrollTrigger);

  const props = defineProps({
    active: {
      type: Boolean,
      default: true,
    },
  });

  const emit = defineEmits(['start', 'done'])

  const outerWrapperRef = useTemplateRef('outerWrapperRef');
  const innerWrapperRef = useTemplateRef('innerWrapperRef');
  const offset = 0.1; // Initial delay.
  const randomDelay = +(Math.random() * 0.7 + 0.2).toFixed(2) + offset;
  let ctx;
  let revealTimeline;

  onMounted(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!props.active || prefersReducedMotion) {
      emit("start");
      revealContent();
      emit("done");
      return;
    }

    ctx = gsap.context(() => {
      gsap.set([innerWrapperRef.value, '.anim-reveal-columns rect'], {
        autoAlpha: 0,
      })
      revealTimeline = gsap.timeline({
        delay: randomDelay,
        onStart: () => {
          emit('start')
        },
        onComplete: () => {
          emit('done')
        },
      })
        .to('.anim-reveal-columns rect', {
          '--scaleYColumnsReveal': "100%",
          duration: 1,
          ease: "power4.inOut",
          onStart: () => {
            gsap.set('.anim-reveal-columns rect', {
              '--transformOrigin': "top",
              autoAlpha: 1,
            })
          },
          onComplete: () => {
            gsap.set('.anim-reveal-columns rect', {
              '--transformOrigin': "bottom",
            })
            gsap.set(innerWrapperRef.value, {
              autoAlpha: 1,
            })
          }
        })
        .to('.anim-reveal-columns rect', {
          delay: 0.2,
          '--scaleYColumnsReveal': 0,
          stagger: {
            each: 0.035,
            from: "random"
          },
          duration: 0.8,
          ease: "power4.inOut",
          onComplete: () => {
            gsap.set('.anim-reveal-columns', {
              autoAlpha: 0,
            })
          }
        })

    }, outerWrapperRef.value);
  })

  watch(
    () => props.active,
    (active) => {
      if (!active) stopReveal();
    },
    { flush: "sync" }
  );

  function revealContent() {
    if (innerWrapperRef.value) {
      gsap.set(innerWrapperRef.value, { autoAlpha: 1 });
    }

    const overlay = outerWrapperRef.value?.querySelector(".anim-reveal-columns");
    if (overlay) gsap.set(overlay, { autoAlpha: 0 });
  }

  function stopReveal() {
    revealTimeline?.kill();
    revealTimeline = undefined;

    ctx?.revert();
    ctx = undefined;

    // Keep the outgoing page legible while its shared route transition runs.
    revealContent();
  }

  onUnmounted(() => {
    revealTimeline?.kill();
    ctx?.revert();
  });
</script>

<style>
  :root {
    --scaleYColumnsReveal: 0;
    --transformOrigin: 'top';
  }

  .anim-reveal-columns rect {
    transform: scaleY(var(--scaleYColumnsReveal));
    transform-origin: var(--transformOrigin);
    will-change: auto;
  }
</style>
