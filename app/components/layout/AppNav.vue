<template>
  <div>
    <div class="button-nav-icon-wrapper fixed top-0 right-0 z-100 m-8 mix-blend-difference">
      <button class="button-nav-icon focus:outline-none focus:ring-0 cursor-pointer" aria-label="Open menu" @click="handleClick">
        <NavIcon :is-open="isOpen" />
      </button>
    </div>

    <div ref="navWrapperRef" class="nav-wrapper fixed top-0 right-0 z-95 flex flex-col justify-center items-center w-full h-lvh bg-black text-white text-5xl sm:text-7xl text-center transition-all duration-500 ease-in-out" :class="isOpen ? 'open' : 'pointer-events-none'">
      <AnimationGlitch v-if="isOpen" class="absolute z-10 inset-0 h-screen" />

      <!-- Grupo 1: Navegación principal -->
      <nav class="main-navigation" aria-label="Main navigation">
        <ul class="relative z-90 flex flex-col gap-3 sm:gap-4 px-12 uppercase">
          <li>
            <AnimationTextShadow>
              <NuxtLinkLocale to="/">{{ $t('pages.home.name') }}</NuxtLinkLocale>
            </AnimationTextShadow>
          </li>
          <li>
            <AnimationTextShadow>
              <NuxtLinkLocale to="band">{{ $t('pages.band.name') }}</NuxtLinkLocale>
            </AnimationTextShadow>
          </li>
          <li>
            <AnimationTextShadow>
              <NuxtLinkLocale to="music">{{ $t('pages.music.name') }}</NuxtLinkLocale>
            </AnimationTextShadow>
          </li>
          <li>
            <AnimationTextShadow>
              <NuxtLinkLocale to="merch">{{ $t('pages.merch.name') }}</NuxtLinkLocale>
            </AnimationTextShadow>
          </li>
        </ul>
      </nav>

      <!-- Grupo 2: Call to Action + Selector de idioma -->
      <div class="relative z-90 mt-12 sm:mt-16 flex flex-col items-center gap-2 text-base leading-none">
        <nav class="social-navigation flex" aria-label="Contact">
          <button
            type="button"
            data-cal-namespace="zenIntroCall"
            data-cal-link="aberu-ar-pei6iq/intro-call-w-aberu"
            data-cal-config='{"layout":"month_view","theme":"light"}'
            class="button_wrap group relative isolate inline-flex items-center gap-3.5 sm:gap-4 overflow-hidden rounded-[2px] bg-white py-2 pl-3.5 pr-2 sm:py-2.5 sm:pl-4 sm:pr-2.5 text-left text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-black cursor-pointer transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transition-none"
          >
            <!-- Texto con máscara y animación de transición -->
            <span class="button_text_wrap relative z-10 block overflow-hidden py-0.5">
              <span class="button_text block font-bold leading-none [text-shadow:0_1.25em_0_currentColor] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[1.25em] group-focus-visible:-translate-y-[1.25em] motion-reduce:transition-none">
                Tell us your story
              </span>
            </span>

            <!-- Contenedor de la flecha con fondo independiente y doble SVG -->
            <span
              class="button_aside relative z-10 flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center overflow-hidden rounded-[2px] text-white"
              aria-hidden="true"
            >
              <!-- Fondo negro animado -->
              <span class="button_aside_bg absolute inset-0 rounded-[2px] bg-black transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[0.92] group-focus-visible:scale-[0.92] motion-reduce:transition-none"></span>

              <!-- Flecha 1: Sale hacia arriba a la derecha -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 12 12"
                fill="none"
                class="button_arrow relative z-10 h-[18px] w-[18px] sm:h-5 sm:w-5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[160%] group-hover:-translate-y-[160%] group-focus-visible:translate-x-[160%] group-focus-visible:-translate-y-[160%] motion-reduce:transition-none"
              >
                <path d="M8.90954 9.09046L9 3L2.90954 3.09046L2.90213 4.32367L6.86437 4.25391L2.55914 8.55914L3.44086 9.44086L7.74609 5.13563L7.68708 9.10862L8.90954 9.09046Z" fill="currentColor" />
              </svg>

              <!-- Flecha 2 (is-entering): Entra desde abajo a la izquierda -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 12 12"
                fill="none"
                class="button_arrow is-entering absolute z-10 h-[18px] w-[18px] sm:h-5 sm:w-5 -translate-x-[160%] translate-y-[160%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0 group-hover:translate-y-0 group-focus-visible:translate-x-0 group-focus-visible:translate-y-0 motion-reduce:transition-none"
              >
                <path d="M8.90954 9.09046L9 3L2.90954 3.09046L2.90213 4.32367L6.86437 4.25391L2.55914 8.55914L3.44086 9.44086L7.74609 5.13563L7.68708 9.10862L8.90954 9.09046Z" fill="currentColor" />
              </svg>
            </span>
          </button>
        </nav>

        <NavLang class="!mt-0 !pt-0" />
      </div>
    </div>
  </div>
</template>

<script setup>
  import gsap from "gsap"

  const isOpen = ref(false)
  const navWrapperRef = useTemplateRef('navWrapperRef')
  const route = useRoute()

  const CAL_NAMESPACE = "zenIntroCall"

  watch(route, () => {
    isOpen.value = false
  })

  const handleClick = () => {
    isOpen.value = !isOpen.value
  }

  function initializeCalEmbed() {
    if (window.Cal?.ns?.[CAL_NAMESPACE]) return

    (function (C, A, L) {
      const push = (api, args) => api.q.push(args)
      const d = C.document

      C.Cal = C.Cal || function () {
        const cal = C.Cal
        const args = arguments

        if (!cal.loaded) {
          cal.ns = {}
          cal.q = cal.q || []
          d.head.appendChild(d.createElement("script")).src = A
          cal.loaded = true
        }

        if (args[0] === L) {
          const api = function () {
            push(api, arguments)
          }
          const namespace = args[1]
          api.q = api.q || []

          if (typeof namespace === "string") {
            cal.ns[namespace] = api
            push(api, args)
          } else {
            push(cal, args)
          }

          return
        }

        push(cal, args)
      }
    })(window, "https://app.cal.com/embed/embed.js", "init")

    window.Cal("init", CAL_NAMESPACE, { origin: "https://app.cal.com" })
    window.Cal.ns[CAL_NAMESPACE]("ui", {
      styles: {
        branding: {
          brandColor: "#000000",
        },
      },
      hideEventTypeDetails: false,
      layout: "month_view",
    })
  }

  onMounted(() => {
    initializeCalEmbed()

    let isFirstPageLoad = true

    gsap.set(navWrapperRef.value, { clipPath: 'inset(0% 0% 100% 0%)', })

    const tlOpen = gsap
      .timeline({
        paused: true,
        onStart() {
          gsap.set('.nav-wrapper ul li', {
            clipPath: 'inset(0% 0% 0% 0%)',
            autoAlpha: 1,
            y: 0
          })
        },
        onComplete() {
          gsap.set('.nav-wrapper ul li', {
            clipPath: 'none'
          })
        }
      })
      .to(navWrapperRef.value, {
        duration: 0.2,
        clipPath: 'inset(0% 0% 0% 0%)',
        ease: 'power2.inOut'
      })
      .fromTo('.nav-wrapper ul li > span', {
        yPercent: -200,
      }, {
        yPercent: 0,
        duration: 0.5,
        stagger: 0.04,
        ease: 'power2.inOut'
      }, '<')

    const tlClose = gsap
      .timeline({
        paused: true,
      })
      .fromTo('.nav-wrapper ul li', {
        autoAlpha: 1,
        y: 0,
      }, {
        duration: 0.4,
        autoAlpha: 0,
        y: -50,
        ease: 'power4.in',
      })
      .fromTo(navWrapperRef.value, {
        clipPath: 'inset(0% 0% 0% 0%)',
      }, {
        duration: 0.1,
        clipPath: 'inset(0% 0% 100% 0%)',
        ease: 'power4.inOut'
      }, '<0.25')


    watchEffect(() => {
      if (isOpen.value) {
        tlOpen.play(0)
      } else {
        // Avoid animation on first page load.
        if (!isFirstPageLoad) {
          tlClose.play(0)
        } else {
          tlClose.revert()
        }
      }

      isFirstPageLoad = false
    })
  })

</script>

<style scoped>
  .button-nav-icon {
    animation: anim-icon-init .7s .2s ease forwards;
    transform: scaleX(0);
  }

  @keyframes anim-icon-init {
    0% {
      transform: scaleX(0);
    }

    100% {
      transform: scaleX(1);
    }
  }

  .button-nav-icon:hover {
    :deep(.line:nth-child(1)) {
      animation: anim-icon-line 1.2s ease-in-out infinite;
    }

    :deep(.line:nth-child(2)) {
      animation: anim-icon-line 1s ease-in-out infinite;
    }

    :deep(.line:nth-child(3)) {
      animation: anim-icon-line 1.35s ease-in-out infinite;
    }
  }

  @keyframes anim-icon-line {
    0% {
      transform: scaleX(1);
    }

    50% {
      transform: scaleX(1.2);
    }

    100% {
      transform: scaleX(1);
    }
  }
</style>
